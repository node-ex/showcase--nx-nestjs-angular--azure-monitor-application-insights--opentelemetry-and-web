import { Tracer, SpanKind, Span, trace } from '@opentelemetry/api';

interface ClassType {
  new (...args: unknown[]): unknown;
  name: string;
}

type MethodDecorator = (
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;

/**
 * Decorator factory that creates a method decorator for OpenTelemetry tracing.
 * @param tracer The OpenTelemetry tracer instance
 * @param spanName The name of the span
 * @returns A method decorator that wraps the method execution with OpenTelemetry tracing
 */
export function Trace(tracer: Tracer, spanName?: string): MethodDecorator {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = function (...args: unknown[]): unknown {
      const className = target.constructor.name;
      const usedSpanName = spanName ?? `${className}.${propertyKey}`;

      return tracer.startActiveSpan(
        usedSpanName,
        { kind: SpanKind.INTERNAL },
        async (span: Span) => {
          try {
            const result = await originalMethod.apply(this, args);
            return result;
          } catch (error) {
            span.recordException(error as Error);
            throw error;
          } finally {
            span.end();
          }
        },
      );
    };

    return descriptor;
  };
}

/**
 * Class decorator that automatically applies tracing to all methods in a class.
 * @param spanNamePrefix Optional prefix for span names
 * @returns A class decorator that adds tracing to all methods
 */
export function TraceClass(spanNamePrefix?: string) {
  return function <T extends ClassType>(constructor: T): T {
    const tracer = trace.getTracer(constructor.name);

    const methodNames = Object.getOwnPropertyNames(
      constructor.prototype,
    ).filter(
      (name) =>
        name !== 'constructor' &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof constructor.prototype[name] === 'function',
    );

    /* Apply the Trace decorator to each method */
    for (const methodName of methodNames) {
      const descriptor = Object.getOwnPropertyDescriptor(
        constructor.prototype,
        methodName,
      );

      if (descriptor && typeof descriptor.value === 'function') {
        const usedSpanName = spanNamePrefix
          ? `${spanNamePrefix}.${methodName}`
          : `${String(constructor.name)}.${methodName}`;

        const tracedDescriptor = Trace(tracer, usedSpanName)(
          constructor.prototype as object,
          methodName,
          descriptor,
        );

        Object.defineProperty(
          constructor.prototype,
          methodName,
          tracedDescriptor,
        );
      }
    }

    return constructor;
  };
}
