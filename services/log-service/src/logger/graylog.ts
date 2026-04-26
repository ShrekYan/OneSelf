import * as dgram from 'dgram';
import type { LoggerConfig, GelfMessage } from './types';
import { levelToSyslog, SyslogLevel } from './types';

/**
 * Compress Zlib is optional, we send uncompressed for simplicity
 * GELF over UDP doesn't support compression anyway for large messages
 */

/**
 * Build GELF message from log data according to GELF v1.1 spec
 * @see https://docs.graylog.org/docs/gelf
 */
export function buildGelfMessage(
  config: LoggerConfig,
  data: Record<string, unknown>,
): GelfMessage {
  const level = (data.level as string) || 'info';

  // Extract short message - GELF requires this field to be non-empty
  let shortMessage = '';
  if (typeof data.message === 'string' && data.message) {
    shortMessage = data.message;
  } else if (typeof data.errorMessage === 'string' && data.errorMessage) {
    shortMessage = data.errorMessage;
  } else if (typeof data.url === 'string' && typeof data.method === 'string') {
    shortMessage = `${data.method} ${data.url}`;
  } else {
    shortMessage = JSON.stringify(data);
  }

  // Extract full message/stack for errors
  let fullMessage: string | undefined;
  if (typeof data.stack === 'string' && data.stack) {
    fullMessage = data.stack;
  } else if (typeof data.full_message === 'string' && data.full_message) {
    fullMessage = data.full_message;
  }

  // Map level to syslog numeric level (required by GELF)
  const gelfLevel = levelToSyslog[level] || SyslogLevel.INFO;

  // Unix timestamp in seconds (required by GELF)
  const timestamp = data.timestamp
    ? new Date(data.timestamp as string).getTime() / 1000
    : Date.now() / 1000;

  // GELF v1.1 required fields: version, host, short_message, level, timestamp
  const gelf: GelfMessage = {
    version: '1.1',
    host: config.hostname,
    short_message: shortMessage.substring(0, 1000),
    full_message: fullMessage,
    level: gelfLevel,
    timestamp,
  };

  // Add all custom fields with underscore prefix (GELF spec requirement)
  for (const [key, value] of Object.entries(data)) {
    if (
      key !== 'version' &&
      key !== 'host' &&
      key !== 'short_message' &&
      key !== 'full_message' &&
      key !== 'level' &&
      key !== 'timestamp'
    ) {
      // Skip null/undefined values per GELF recommendation
      if (value !== null && value !== undefined) {
        gelf[`_${key}`] = value;
      }
    }
  }

  return gelf;
}

/**
 * Send log data to Graylog via UDP
 */
export async function sendToGraylog(
  config: LoggerConfig,
  data: Record<string, unknown>,
): Promise<void> {
  if (!config.graylogHost || !config.graylogEnabled) {
    return;
  }

  const gelfMessage = buildGelfMessage(config, data);
  const jsonBuffer = Buffer.from(JSON.stringify(gelfMessage), 'utf8');

  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4');

    socket.send(
      jsonBuffer,
      0,
      jsonBuffer.length,
      config.graylogPort,
      config.graylogHost,
      err => {
        socket.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}
