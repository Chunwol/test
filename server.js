const express = require('express');

const app = express();
const users = new Map();

app.use(express.json());

app.post('/api/v1/auth/signup', (request, response) => {
  const { loginId, password, name } = request.body;

  if (!loginId || !password || !name) {
    return response.status(400).json({ message: '필수 가입 정보를 입력해 주세요.' });
  }

  const user = {
    loginId,
    password,
    name,
    active: true
  };

  users.set(loginId, user);
  return response.status(201).json({ loginId: user.loginId, name: user.name });
});

app.post('/api/v1/auth/login', (request, response) => {
  const { loginId, password } = request.body;
  const user = users.get(loginId);

  if (!user || user.password !== password) {
    return response.status(401).json({ message: '로그인 정보가 올바르지 않습니다.' });
  }

  return response.json({
    accessToken: `demo-token-${user.loginId}`,
    user: { loginId: user.loginId, name: user.name }
  });
});

app.get('/api/v1/users/:loginId', (request, response) => {
  const user = users.get(request.params.loginId);

  if (!user) {
    return response.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  return response.json({
    loginId: user.loginId,
    name: user.name,
    active: user.active
  });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Signup API listening on port ${port}`);
  });
}

module.exports = app;
