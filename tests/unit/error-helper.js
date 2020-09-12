const tap = require('tap')

const ErrorHelper = require('../../lib/error-helper')

class MockedInstrumentationApi {
  constructor() {
    this.mockedCollectedErrors = []

    const parentThis = this;
    this.logger = {
      trace: () => {
      }
    }

    this.agent = {
      errors: {
        add: function(transaction, error) {
          parentThis.mockedCollectedErrors.push(error)
        }
      }
    },

    this.tracer = {
      getTransaction: function() {
      }
    }
  }
}

const mockInstrumentationApi = new MockedInstrumentationApi;


tap.test('ErrorHelper tests', (t) => {
  const errorHelper = new ErrorHelper;

  const fixture1 = false
  t.equals(
    false,
    errorHelper.isValidRequestContext(mockInstrumentationApi, fixture1),
    'returns false when requestContext is false'
  )

  const fixture2 = {
  }
  t.equals(
    false,
    errorHelper.isValidRequestContext(mockInstrumentationApi, fixture2),
    'returns false when errors not set'
  )

  const fixture3 = {
    errors:null
  }
  t.equals(
    false,
    errorHelper.isValidRequestContext(mockInstrumentationApi, fixture3),
    'returns false when errors not an array'
  )

  const fixture4 = {
    errors:[(new Error),(new Error)]
  }
  t.equals(
    true,
    errorHelper.isValidRequestContext(mockInstrumentationApi, fixture4),
    'returns true when errors array set'
  )

  errorHelper.addErrorsFromApolloRequestContext(mockInstrumentationApi, fixture1)
  errorHelper.addErrorsFromApolloRequestContext(mockInstrumentationApi, fixture2)
  errorHelper.addErrorsFromApolloRequestContext(mockInstrumentationApi, fixture3)
  errorHelper.addErrorsFromApolloRequestContext(mockInstrumentationApi, fixture4)
  t.equals(
    mockInstrumentationApi.mockedCollectedErrors.length,
    2,
    'captures only valid errors'
  )

  t.end()
})