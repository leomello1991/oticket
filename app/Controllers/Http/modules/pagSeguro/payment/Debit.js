const rules = use('App/Validators/rules/paymentDebit')
const { validate } = use('Validator')
const PaymentDebitPagSeguroService = use(
  'App/Services/vendas/pagSeguro/payment/PaymentDebitPagSeguroService'
)
class GeneratedBillet {
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
        bankName
      }
    } = validation
    const { token, senderHash, itens } = request.post()
    const paymentDebitPagSeguroService = new PaymentDebitPagSeguroService()
    const {
      error,
      info,
      debitInfoResponseDataChange: transaction
    } = await paymentDebitPagSeguroService.execute({
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
      bankName
    })
    if (error instanceof Error) {
      return response.status(info.status).send({ message: info.message })
    }
    return response.status(200).send({ transaction })
  }
}

module.exports = GeneratedBillet
