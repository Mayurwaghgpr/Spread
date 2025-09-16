export function lazyRouteLoader(path) {
  return async (req, res, next) => {
    const module = await import(path);
    return module.default(req, res, next);
  };
}

