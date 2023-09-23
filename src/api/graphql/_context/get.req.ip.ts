import { Context } from 'elysia';
import * as requestIp from 'request-ip';

/**
 * The function `getRequestIpAddress` returns the IP address of a request.
 * @param request - The `request` parameter is an object that represents the incoming HTTP request. It
 * typically contains information such as the request headers, body, URL, and other metadata.
 * @returns the IP address of the client making the request.
 */
export function getRequestIpAddress(request: Context['request']) {
  const ipAddress = requestIp.getClientIp(
    request as unknown as requestIp.Request,
  );

  return ipAddress || 'UNKNOWN';
}
