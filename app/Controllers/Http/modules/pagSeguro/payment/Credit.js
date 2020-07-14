const rules = use('App/Validators/rules/paymentCredit')
const { validate } = use('Validator')
const PaymentCreditPagSeguroService = use(
  'App/Services/vendas/pagSeguro/payment/PaymentCreditPagSeguroService'
)
class PaymentCredit {
  async store ({ request, response }) {
    const validation = await validate(request.post(), rules)
    if (validation.fails()) {
      return response.send({
        error: true,
        message: 'missing required fields'
      })
    }
    const {
      _data: {
        sellerEmail,
        extraAmount,
        notificationUrl,
        reference,
        buyerName,
        buyerCPF,
        buyerAreaCode,
        buyerPhone,
        buyerEmail,
        shippingAddressStreet,
        shippingAddressNumber,
        shippingAddressComplement,
        shippingAddressDistrict,
        shippingAddressPostalCode,
        shippingAddressCity,
        shippingAddressState,
        shippingAddressCountry,
        shippingType,
        shippingCost,
        creditCardToken,
        installmentQuantity,
        installmentValue,
        noInterestInstallmentQuantity,
        creditCardHolderName,
        creditCardHolderCPF,
        creditCardHolderBirthDate,
        creditCardHolderAreaCode,
        creditCardHolderPhone,
        billingAddressStreet,
        billingAddressNumber,
        billingAddressComplement,
        billingAddressDistrict,
        billingAddressPostalCode,
        billingAddressCity,
        billingAddressState,
        billingAddressCountry
      }
    } = validation
    const { token, senderHash, itens } = request.post()
    const paymentCreditPagSeguroService = new PaymentCreditPagSeguroService()
    const {
      error,
      info,
      creditInfoResponseDataChange: transaction
    } = await paymentCreditPagSeguroService.execute({
      token,
      senderHash,
      sellerEmail,
      extraAmount,
      itens,
      notificationUrl,
      reference,
      buyerName,
      buyerCPF,
      buyerAreaCode,
      buyerPhone,
      buyerEmail,
      shippingAddressStreet,
      shippingAddressNumber,
      shippingAddressComplement,
      shippingAddressDistrict,
      shippingAddressPostalCode,
      shippingAddressCity,
      shippingAddressState,
      shippingAddressCountry,
      shippingType,
      shippingCost,
      // token
      creditCardToken,
      installmentQuantity,
      installmentValue,
      noInterestInstallmentQuantity,
      creditCardHolderName,
      creditCardHolderCPF,
      creditCardHolderBirthDate,
      creditCardHolderAreaCode,
      creditCardHolderPhone,
      billingAddressStreet,
      billingAddressNumber,
      billingAddressComplement,
      billingAddressDistrict,
      billingAddressPostalCode,
      billingAddressCity,
      billingAddressState,
      billingAddressCountry
    })
    if (error instanceof Error) {
      return response.status(info.status).send({ message: info.message })
    }
    return response.status(200).send({ transaction })
  }
}

module.exports = PaymentCredit
