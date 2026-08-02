import http from 'k6/http';
import { check } from 'k6';

const NODE_URL = __ENV.NODE_URL || 'http://localhost:3000';
const GO_URL = __ENV.GO_URL || 'http://localhost:8080';

export const options = {
  scenarios: {
    node: {
      executor: 'ramping-vus',
      exec: 'testNode',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 150 },
        { duration: '1m', target: 150 },
      ],
    },
    go: {
      executor: 'ramping-vus',
      exec: 'testGo',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 150 },
        { duration: '1m', target: 150 },
      ],
    },
  },
  thresholds: {
    'http_req_duration{scenario:node}': ['p(95)<500', 'p(99)<750'],
    'http_req_duration{scenario:go}': ['p(95)<500', 'p(99)<750'],
    'http_req_failed{scenario:node}': ['rate<0.01'],
    'http_req_failed{scenario:go}': ['rate<0.01'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

function hit(url) {
  const res = http.get(`${url}/health`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body status is ok': (r) => r.json().status === 'ok',
    'timestamp is number': (r) => typeof r.json().timestamp === 'number',
  });
}

export function testNode() {
  hit(NODE_URL);
}

export function testGo() {
  hit(GO_URL);
}
