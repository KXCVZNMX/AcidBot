use axum::http::Uri;
use axum::response::IntoResponse;
use axum::Router;
use axum::routing::get;
use vercel_runtime::Error;
use tower::ServiceBuilder;
use vercel_runtime::axum::VercelLayer;

async fn ping() -> impl IntoResponse {
    "PONG"
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new()
        .route("/api/v2/ping", get(ping));

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);
    vercel_runtime::run(app).await
}