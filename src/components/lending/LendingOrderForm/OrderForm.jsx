// @flow
import OrderFormRenderer from './OrderFormRenderer'
import { withOrderFormLogic } from '../OrderFormCommon'

const OrderForm = withOrderFormLogic(OrderFormRenderer)

export default OrderForm
