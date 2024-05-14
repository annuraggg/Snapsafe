interface Token {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}

export default Token;