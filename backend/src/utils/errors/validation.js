import { ControllerError } from "./app-error.js";

// strict api contract: reject any unexpected data in body, query, or params

export const rejectUnexpectedData = (
  req,
  { allowedBody = [], allowedQuery = [], allowedParams = [] } = {},
) => {
  const getUnexpectedKeys = (source, allowed) =>
    Object.keys(source ?? {}).filter((key) => !allowed.includes(key));

  const unexpectedBody = getUnexpectedKeys(req.body, allowedBody);
  const unexpectedQuery = getUnexpectedKeys(req.query, allowedQuery);
  const unexpectedParams = getUnexpectedKeys(req.params, allowedParams);

  const details = {};
  if (unexpectedBody.length > 0) details.body = unexpectedBody;
  if (unexpectedQuery.length > 0) details.query = unexpectedQuery;
  if (unexpectedParams.length > 0) details.params = unexpectedParams;

  if (Object.keys(details).length > 0) {
    throw new ControllerError({
      message: "Request contains unexpected data.",
      statusCode: 400,
      code: "UNEXPECTED_REQUEST_DATA",
      details,
    });
  }
};
