let app: any = null;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      const serverModule: any = await import('../server-dist/server.cjs');
      // esbuild's CJS interop wraps the default export as { default: app };
      // Node's ESM loader then wraps that again, so unwrap one extra level.
      app = serverModule.default?.default ?? serverModule.default;
    }
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel API] Critical initialization error:', err);
    res.status(500).json({
      error: 'Critical initialization error in Vercel Serverless Function',
      message: err.message || String(err),
      stack: err.stack || null
    });
  }
}
