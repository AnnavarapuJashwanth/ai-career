// Minimal ESM shim for `prop-types` so that libraries expecting a default
// export can import it without runtime errors. This is NO-OP validation
// and is safe because we don't rely on runtime PropTypes in this app.

function createType() {
  const fn = () => null;
  fn.isRequired = fn;
  return fn;
}

const PropTypes = new Proxy(
  {},
  {
    get() {
      return createType();
    },
  }
);

export default PropTypes;
