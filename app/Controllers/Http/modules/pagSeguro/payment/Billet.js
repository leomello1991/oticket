const rules = use('App/Validators/rules/generatedBill')
const { validate } = use('Validator')
const GeneratedBilletPagSeguroService = use('App/Services/vendas/pagSeguro/payment/GeneratedBilletPagSeguroService')
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
        shippingCost
      }
    } = validation
    const { token, senderHash, itens } = request.post()
    const createBilletPagSeguroService = new GeneratedBilletPagSeguroService()
    const { error, info, bill } = await createBilletPagSeguroService.execute({
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
      shippingCost
    })
    if (error instanceof Error) {
      return response.status(info.status).send({ message: info.message })
    }
    return response.status(200).send({ bill })
  }
}

module.exports = GeneratedBillet
