import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    peak_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 300 },
        { duration: '1m', target: 300 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body status is ok': (r) => r.json().status === 'ok',
    'timestamp is number': (r) => typeof r.json().timestamp === 'number',
  });
}
