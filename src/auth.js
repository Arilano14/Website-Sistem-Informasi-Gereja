/**
 * WARNING: This file connects this app to Anythings's internal auth system. Do
 * not attempt to edit it. Modifying it will have no effect on your project as it is controlled by our system.
 * Do not import @auth/create or @auth/create anywhere else or it may break. This is an internal package.
 */
import CreateAuth from "@auth/create"
import Credentials from "@auth/core/providers/credentials"
import mysql from 'mysql2/promise'
import { hash, verify } from 'argon2'

function Adapter(pool) {
  return {
    async createVerificationToken(
      verificationToken
    ) {
      const { identifier, expires, token } = verificationToken;
      const sql = `
        INSERT INTO auth_verification_token ( identifier, expires, token )
        VALUES (?, ?, ?)
        `;
      await pool.execute(sql, [identifier, expires, token]);
      return verificationToken;
    },
    async useVerificationToken({
      identifier,
      token,
    }) {
      const sql = `delete from auth_verification_token
      where identifier = ? and token = ?`;
      const selectSql = `SELECT identifier, expires, token FROM auth_verification_token WHERE identifier = ? AND token = ?`;
      const [rows] = await pool.execute(selectSql, [identifier, token]);
      const tokenData = rows[0];

      if (tokenData) {
        await pool.execute(sql, [identifier, token]);
        return tokenData;
      }
      return null;
    },

    async createUser(user) {
      const { name, email, emailVerified, image, role } = user;
      const id = crypto.randomUUID();
      const sql = `
        INSERT INTO auth_users (id, name, email, emailVerified, image, role)
        VALUES (?, ?, ?, ?, ?, ?)`;
      await pool.execute(sql, [
        id,
        name,
        email,
        emailVerified,
        image,
        role || 'user',
      ]);
      return { ...user, id };
    },
    async getUser(id) {
      const sql = 'select * from auth_users where id = ?';
      try {
        const [rows] = await pool.execute(sql, [id]);
        return rows.length === 0 ? null : rows[0];
      } catch {
        return null;
      }
    },
    async getUserByEmail(email) {
      const sql = 'select * from auth_users where email = ?';
      const [rows] = await pool.execute(sql, [email]);
      if (rows.length === 0) {
        return null;
      }
      const userData = rows[0];
      const [accountRows] = await pool.execute(
        'select * from auth_accounts where userId = ?',
        [userData.id]
      );
      return {
        ...userData,
        accounts: accountRows,
      };
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }) {
      const sql = `
          select u.* from auth_users u join auth_accounts a on u.id = a.userId
          where
          a.provider = ?
          and
          a.providerAccountId = ?`;

      const [rows] = await pool.execute(sql, [provider, providerAccountId]);
      return rows.length !== 0 ? rows[0] : null;
    },
    async updateUser(user) {
      const fetchSql = 'select * from auth_users where id = ?';
      const [rows] = await pool.execute(fetchSql, [user.id]);
      const oldUser = rows[0];

      const newUser = {
        ...oldUser,
        ...user,
      };

      const { id, name, email, emailVerified, image } = newUser;
      const updateSql = `
        UPDATE auth_users set
        name = ?, email = ?, emailVerified = ?, image = ?
        where id = ?
      `;
      await pool.execute(updateSql, [
        name,
        email,
        emailVerified,
        image,
        id
      ]);
      return newUser;
    },
    async linkAccount(account) {
      const id = crypto.randomUUID();
      const sql = `
      insert into auth_accounts
      (
        id,
        userId,
        provider,
        type,
        providerAccountId,
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
        password
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        id,
        account.userId,
        account.provider,
        account.type,
        account.providerAccountId,
        account.access_token,
        account.expires_at,
        account.refresh_token,
        account.id_token,
        account.scope,
        account.session_state,
        account.token_type,
        account.extraData?.password,
      ];

      await pool.execute(sql, params);
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error('userId is undef in createSession');
      }
      const id = crypto.randomUUID();
      const sql = `insert into auth_sessions (id, userId, expires, sessionToken)
      values (?, ?, ?, ?)`;

      await pool.execute(sql, [id, userId, expires, sessionToken]);
      return { id, sessionToken, userId, expires };
    },

    async getSessionAndUser(sessionToken) {
      if (sessionToken === undefined) {
        return null;
      }
      const [sessionRows] = await pool.execute(
        `select * from auth_sessions where sessionToken = ?`,
        [sessionToken]
      );
      if (sessionRows.length === 0) {
        return null;
      }
      const session = sessionRows[0];

      const [userRows] = await pool.execute(
        'select * from auth_users where id = ?',
        [session.userId]
      );
      if (userRows.length === 0) {
        return null;
      }
      const user = userRows[0];
      return {
        session,
        user,
      };
    },
    async updateSession(
      session
    ) {
      const { sessionToken } = session;
      const [rows] = await pool.execute(
        `select * from auth_sessions where sessionToken = ?`,
        [sessionToken]
      );
      if (rows.length === 0) {
        return null;
      }
      const originalSession = rows[0];

      const newSession = {
        ...originalSession,
        ...session,
      };
      const sql = `
        UPDATE auth_sessions set
        expires = ?
        where sessionToken = ?
        `;
      await pool.execute(sql, [
        newSession.expires,
        newSession.sessionToken,
      ]);
      return newSession;
    },
    async deleteSession(sessionToken) {
      const sql = `delete from auth_sessions where sessionToken = ?`;
      await pool.execute(sql, [sessionToken]);
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount;
      const sql = `delete from auth_accounts where providerAccountId = ? and provider = ?`;
      await pool.execute(sql, [providerAccountId, provider]);
    },
    async deleteUser(userId) {
      await pool.execute('delete from auth_users where id = ?', [userId]);
      await pool.execute('delete from auth_sessions where userId = ?', [
        userId,
      ]);
      await pool.execute('delete from auth_accounts where userId = ?', [
        userId,
      ]);
    },
  };
}

let pool;
try {
  if (process.env.DATABASE_URL) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  } else {
    console.warn('No DATABASE_URL provided for MySQL pool.');
  }
} catch (error) {
  console.warn('Error creating MySQL pool:', error.message);
}

const adapter = Adapter(pool);

export const { auth } = CreateAuth({
  providers: [Credentials({
    id: 'credentials-signin',
    name: 'Credentials Sign in',
    credentials: {
      email: {
        label: 'Email',
        type: 'email',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
    },
    authorize: async (credentials) => {
      const { email, password } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter.getUserByEmail(email);
      if (!user) {
        return null;
      }
      const matchingAccount = user.accounts.find(
        (account) => account.provider === 'credentials'
      );
      const accountPassword = matchingAccount?.password;
      if (!accountPassword) {
        return null;
      }

      const isValid = await verify(accountPassword, password);
      if (!isValid) {
        return null;
      }

      // return user object with the their profile data
      return user;
    },
  }),
  Credentials({
    id: 'credentials-signup',
    name: 'Credentials Sign up',
    credentials: {
      email: {
        label: 'Email',
        type: 'email',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
      name: { label: 'Name', type: 'text', required: false },
      image: { label: 'Image', type: 'text', required: false },
    },
    authorize: async (credentials) => {
      const { email, password } = credentials;
      if (!email || !password) {
        return null;
      }
      if (typeof email !== 'string' || typeof password !== 'string') {
        return null;
      }

      // logic to verify if user exists
      const user = await adapter.getUserByEmail(email);
      if (!user) {
        const newUser = await adapter.createUser({
          id: crypto.randomUUID(),
          emailVerified: null,
          email,
          name:
            typeof credentials.name === 'string' &&
              credentials.name.trim().length > 0
              ? credentials.name
              : undefined,
          image:
            typeof credentials.image === 'string'
              ? credentials.image
              : undefined,
          role: 'user', // Default role for self-signup
        });
        await adapter.linkAccount({
          extraData: {
            password: await hash(password),
          },
          type: 'credentials',
          userId: newUser.id,
          providerAccountId: newUser.id,
          provider: 'credentials',
        });
        return newUser;
      }
      return null;
    },
  })],
  pages: {
    signIn: '/account/signin',
    signOut: '/account/logout',
  },
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.role = user.role;
        session.user.id = user.id;
      }
      return session;
    },
  },
})