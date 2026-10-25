// const TOKEN_KEY = 'stockflow_token';

// export const getToken = () => {
//   try {
//     return localStorage.getItem(TOKEN_KEY);
//   } catch {
//     return null;
//   }
// };
// export const setToken = (t) => {
//   try {
//     if (t) localStorage.setItem(TOKEN_KEY, t);
//     else localStorage.removeItem(TOKEN_KEY);
//     console.log(
//       'Stored token:',
//       localStorage.getItem(TOKEN_KEY)
//     );
//   } catch {
//     /* storage unavailable */
//   console.error('Token storage failed:', error);

//   }
// };
const TOKEN_KEY = 'TOKEN_KEY';

export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('getToken:', token);
    return token;
  } catch (error) {
    console.error('getToken error:', error);
    return null;
  }
};

// export const setToken = (token) => {
//   try {
//     console.log('setToken received:', typeof token, token);

//     if (token) {
//       localStorage.setItem(TOKEN_KEY, token);
//     } else {
//       localStorage.removeItem(TOKEN_KEY);   }

//   } catch (error) {
//     console.error('setToken error:', error);
//   }
// };
export const setToken = (token) => {
  try {
    console.log('1. Token received:', typeof token);

    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
      console.log('2. Token removed');
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    console.log('2. Token saved successfully');

    const saved = localStorage.getItem(TOKEN_KEY);
    console.log('3. Token exists in storage:', Boolean(saved));
    console.log('4. Token matches:', saved === token);
  } catch (error) {
    console.error('Token storage error:', error);
  }
};

export class ApiError extends Error {
  constructor(errors, status) {
    super(errors[0] || 'Request failed');
    this.errors = errors;
    this.status = status;
  }
}

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => (onUnauthorized = fn);

// async function request(method, path, body) {
//   const token = getToken();
//   let res;
//   try {
//     res = await fetch(`/api${path}`, {
//       method,
//       headers: {
//         ...(body ? { 'Content-Type': 'application/json' } : {}),
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: body ? JSON.stringify(body) : undefined,
//     });
//   } catch {
//     throw new ApiError(['Cannot reach the server. Is it running?'], 0);
//   }
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     // An expired/invalid token on a protected call sends the user back to login.
//     if (res.status === 401 && token && !path.startsWith('/auth/login')) onUnauthorized();
//     throw new ApiError(data.errors || ['Request failed.'], res.status);
//   }
//   return data;
// }


async function request(method, path, body) {
  const token = getToken();

  console.log('[API] Path:', path);
  console.log('[API] Token found:', Boolean(token));

  const headers = {};

  if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('[API] Authorization attached:', Boolean(headers.Authorization));

  let res;

  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    console.error('[API] Network error:', error);
    throw new ApiError(['Cannot reach the server. Is it running?'], 0);
  }

  const data = await res.json().catch(() => ({}));

  console.log('[API] Status:', res.status);

  if (!res.ok) {
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      onUnauthorized();
    }

    throw new ApiError(data.errors || ['Request failed.'], res.status);
  }

  return data;
}


export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b ?? {}),
  put: (p, b) => request('PUT', p, b ?? {}),
  del: (p) => request('DELETE', p),
};
