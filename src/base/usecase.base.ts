export abstract class BaseUseCase<Request, Response> {
  abstract execute(req: Request): Promise<Response>;
}
