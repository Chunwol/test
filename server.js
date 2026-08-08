const express = require('express');

const app = express();
const users = new Map();
const vaccinationHistory = [];

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

app.post('/api/v1/vaccination-history', (request, response) => {
  const { petId, vaccinationType, vaccinatedAt } = request.body;

  if (!petId || !vaccinationType || !vaccinatedAt) {
    return response.status(400).json({ message: '접종 완료 기록을 입력해 주세요.' });
  }

  const record = {
    id: vaccinationHistory.length + 1,
    petId,
    vaccinationType,
    vaccinatedAt
  };

  vaccinationHistory.push(record);
  return response.status(201).json(record);
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Signup API listening on port ${port}`);
  });
}

module.exports = app;
