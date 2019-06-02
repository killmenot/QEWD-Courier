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

const { ExecutionContextMock } = require('@tests/mocks');
const StatusService = require('@lib/services/statusService');

describe('openehr-service/lib/services/statusService', () => {
  let ctx;
  let statusService;

  let statusCache;

  beforeEach(() => {
    ctx = new ExecutionContextMock();
    statusService = new StatusService(ctx);

    statusCache = ctx.cache.statusCache;

    ctx.freeze();
  });

  describe('#create (static)', () => {
    it('should initialize a new instance', async () => {
      const actual = StatusService.create(ctx);

      expect(actual).toEqual(jasmine.any(StatusService));
      expect(actual.ctx).toBe(ctx);
      expect(actual.statusCache).toBe(statusCache);
    });
  });

  describe('#check', () => {
    it('should return null', () => {
      const expected = null;

      const patientId = 9999999000;
      const actual = statusService.check(patientId);

      expect(statusCache.get).toHaveBeenCalledWith(9999999000);
      expect(actual).toEqual(expected);
    });

    it('should increment requestNo and return updated state ', () => {
      const expected = {
        requestNo: 4
      };

      statusCache.get.and.returnValue({
        requestNo: 3
      });

      const patientId = 9999999000;
      const actual = statusService.check(patientId);

      expect(statusCache.get).toHaveBeenCalledWith(9999999000);
      expect(statusCache.set).toHaveBeenCalledWith(9999999000, {
        requestNo: 4
      });

      expect(actual).toEqual(expected);
    });
  });

  describe('#get', () => {
    it('should return record state ', () => {
      const expected = {
        status: 'loading_data',
        new_patient: 'not_known_yet',
        requestNo: 1
      };

      const dbData = {
        status: 'loading_data',
        new_patient: 'not_known_yet',
        requestNo: 1
      };
      statusCache.get.and.returnValue(dbData);

      const patientId = 9999999000;
      const actual = statusService.get(patientId);

      expect(statusCache.get).toHaveBeenCalledWith(9999999000);
      expect(actual).toEqual(expected);
    });
  });

  describe('#create', () => {
    it('should create record state ', () => {
      const patientId = 9999999000;
      const state = {
        status: 'loading_data',
        new_patient: true,
        requestNo: 5
      };

      statusService.create(patientId, state);

      expect(statusCache.set).toHaveBeenCalledWith(9999999000, {
        status: 'loading_data',
        new_patient: true,
        requestNo: 5
      });
    });
  });

  describe('#update', () => {
    it('should update record state ', () => {
      const patientId = 9999999000;
      const state = {
        status: 'ready',
        new_patient: true,
        requestNo: 7
      };

      statusService.update(patientId, state);

      expect(statusCache.set).toHaveBeenCalledWith(9999999000, {
        status: 'ready',
        new_patient: true,
        requestNo: 7
      });
    });
  });
});
