export class PaymentJob {
  async handle(data: { paymentId: string }) {
    console.log('Processing payment:', data.paymentId);
  }
}
