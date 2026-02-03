import { exportResult } from '../src/services/export.service.js'
import { AAB_APP_TYPE, AAB_ENV_KEY, AAB_LIST_ENV_KEY, APK_APP_TYPE, APK_ENV_KEY, APK_LIST_ENV_KEY } from '../src/types.js'
import * as core from '@actions/core'
import { jest } from '@jest/globals'

describe('exportResult', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('writes outputs for last APK/AAB artifacts and lists', async () => {
    await exportResult({
      appFiles: [
        { path: '/tmp/app-1.apk', name: 'app-1.apk', type: APK_APP_TYPE },
        { path: '/tmp/app-2.apk', name: 'app-2.apk', type: APK_APP_TYPE },
        { path: '/tmp/app-3.aab', name: 'app-3.aab', type: AAB_APP_TYPE }
      ]
    })

    expect(core.setOutput).toHaveBeenCalledWith(APK_ENV_KEY, '/tmp/app-2.apk')
    expect(core.setOutput).toHaveBeenCalledWith(APK_LIST_ENV_KEY, '/tmp/app-1.apk|/tmp/app-2.apk')
    expect(core.setOutput).toHaveBeenCalledWith(AAB_ENV_KEY, '/tmp/app-3.aab')
    expect(core.setOutput).toHaveBeenCalledWith(AAB_LIST_ENV_KEY, '/tmp/app-3.aab')
  })
})
