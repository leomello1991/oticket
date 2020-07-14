// Dependency Inversion (SOLID)
'use strict'
const api = require('../../../../../Services/apiPagSeguro')
const xmlJs = require('xml-js')
const qs = require('qs')
class PaymentCreditPagSeguroService {
  async execute ({
    token,
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
    senderHash,
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
  }) {
    const infoCredit = {
      paymentMode: 'default',
      paymentMethod: 'creditCard',
      receiverEmail: sellerEmail,
      currency: 'BRL',
      extraAmount,
      notificationUrl,
      reference,
      senderName: buyerName,
      senderCPF: buyerCPF,
      senderAreaCode: buyerAreaCode,
      senderPhone: buyerPhone,
      senderEmail: buyerEmail,
      senderHash,
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
    for (let index = 0; index < itens.length; index++) {
      infoCredit[`itemId${index + 1}`] = (index + 1).toString().padStart(4, '0')
      infoCredit[`itemQuantity${index + 1}`] = itens[index].itemQuantity
      infoCredit[`itemDescription${index + 1}`] = itens[index].itemDescription
      infoCredit[`itemAmount${index + 1}`] = itens[index].itemAmount
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    const parsedBodyContentTypeUrlencodedWwwX = qs.stringify(infoCredit)
    try {
      const { data } = await api.post(`/v2/transactions?email=${sellerEmail}&token=${token}`,
        parsedBodyContentTypeUrlencodedWwwX, headers)

      const convertedData = xmlJs.xml2js(data, { compact: true, spaces: 4 })

      const {
        transaction: {
          date: { _text: date },
          code: { _text: code },
          reference: { _text: credit_reference },
          type: { _text: type },
          status: { _text: status },
          lastEventDate: { _text: lastEventDate },
          paymentMethod: {
            type: {
              _text: type_paymentMethod
            },
            code: {
              _text: code_paymentMethod
            }
          },
          grossAmount: {
            _text: grossAmount
          },
          discountAmount: {
            _text: discountAmount
          },
          feeAmount: {
            _text: feeAmount
          },
          netAmount: {
            _text: netAmount
          },
          extraAmount: {
            _text: credit_extraAmount
          },
          installmentCount: {
            _text: installmentCount
          },
          itemCount: {
            _text: credit_itemCount
          },
          items: { item: items },
          sender: {
            name: {
              _text: sender_name
            },
            email: {
              _text: sender_email
            },
            phone: {
              areaCode: {
                _text: sender_area_code
              },
              number: {
                _text: sender_area_number
              }
            },
            documents: {
              document: {

                value: {
                  _text: cpf
                }
              }
            }
          },
          shipping: {
            address: {
              street: {
                _text: address_street
              },
              number: {
                _text: address_number
              },
              complement: {
                _text: address_complement
              },
              district: {
                _text: address_district
              },
              city: {
                _text: address_city
              },
              state: {
                _text: address_state
              },
              country: {
                _text: address_country
              },
              postalCode: {
                _text: address_postalCode
              }
            },
            type: {
              _text: cost_type
            },
            cost: {
              _text: cost_value
            }
          },
          gatewaySystem: {
            type: {
              _text: gatewayType
            },
            authorizationCode: {
              _text: authorizationCode
            },
            nsu: {
              _text: nsu
            },
            tid: {
              _text: tid
            },
            establishmentCode: {
              _text: establishmentCode
            },
            acquirerName: {
              _text: acquirerName
            }
          }
        }
      } = convertedData

      const newItems = items.map(item => {
        const { id: { _text: id }, description: { _text: description }, quantity: { _text: quantity }, amount: { _text: amount } } = item
        return {
          id,
          description,
          quantity,
          amount
        }
      })
      const creditInfoResponseDataChange = {
        date,
        code,
        reference: credit_reference,
        type,
        status,
        lastEventDate,
        paymentMethod: {
          type: type_paymentMethod,
          code: code_paymentMethod
        },
        grossAmount,
        discountAmount,
        feeAmount,
        netAmount,
        extraAmount: credit_extraAmount,
        installmentCount,
        itemCount: credit_itemCount,
        item: newItems,
        sender: {
          name: sender_name,
          email: sender_email,
          phone: {
            area: sender_area_code,
            number: sender_area_number
          },
          cpf,
          shipping: {
            street: address_street,
            number: address_number,
            complement: address_complement,
            district: address_district,
            city: address_city,
            state: address_state,
            country: address_country,
            postalCode: address_postalCode
          },
          type: cost_type,
          cost: cost_value

        },
        gatewaySystem: {
          type: gatewayType,
          authorizationCode,
          nsu,
          tid,
          establishmentCode,
          acquirerName
        }
      }
      return { creditInfoResponseDataChange }
    } catch (error) {
      return { error: new Error('erro in call message'), info: { message: error.message, status: 401 } }
    }
  }
}
module.exports = PaymentCreditPagSeguroService
