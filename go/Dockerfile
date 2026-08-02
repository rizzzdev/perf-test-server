FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /health-api .

FROM alpine:3.20

RUN adduser -D -H -u 10001 appuser
COPY --from=builder /health-api /usr/local/bin/health-api

USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["health-api"]
