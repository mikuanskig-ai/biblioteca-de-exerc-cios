let app: any = null;

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
      const serverModule = await import('../server');
      app = serverModule.default;
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
