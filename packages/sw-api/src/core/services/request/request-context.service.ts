import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({
	scope: Scope.REQUEST,
})
export class RequestContextService {
	constructor(@Inject(REQUEST) private readonly request) {}

	getCurrentUser() {
		return this.request.user;
	}
}
