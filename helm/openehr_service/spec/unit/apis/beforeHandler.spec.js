/*

 ----------------------------------------------------------------------------
 |                                                                          |
 | Copyright (c) 2018-19 Ripple Foundation Community Interest Company       |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://rippleosi.org                                                     |
 | Email: code.custodian@rippleosi.org                                      |
 |                                                                          |
 | Author: Alexey Kucherenko <alexei.kucherenko@gmail.com>                  |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  02 June 2019

*/

'use strict';

const { ExecutionContext } = require('@lib/core');
const { Worker } = require('@tests/mocks');
const beforeHandler = require('@apis/beforeHandler');

describe('openehr-service/apis/beforeHandler', () => {
  let q;
  let req;
  let finished;

  let qewdSession;

  beforeEach(() => {
    q = new Worker();

    req = {};
    finished = jasmine.createSpy();

    qewdSession =  q.sessions.create('mock');
    q.qewdSessionByJWT.and.returnValue(qewdSession);
  });

  it('should set req.qewdSession', async () => {
    beforeHandler.call(q, req, finished);

    expect(q.qewdSessionByJWT).toHaveBeenCalledWithContext(q, req);
    expect(req.qewdSession).toBe(qewdSession);
  });

  it('should set req.ctx', async () => {
    const ctxMock = {};

    spyOn(ExecutionContext, 'fromQewdSession').and.returnValue(ctxMock);

    beforeHandler.call(q, req, finished);

    expect(ExecutionContext.fromQewdSession).toHaveBeenCalledWith(q, qewdSession);
    expect(req.ctx).toBe(ctxMock);
  });
});
