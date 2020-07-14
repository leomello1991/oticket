// Dependency Inversion (SOLID)
'use strict'
const api = require('../../../../../Services/apiPagSeguro')
const xmlJs = require('xml-js')
const qs = require('qs')
class CreateSessionIdPagSeguroService {
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
    senderHash
  }) {
    const billet = {
      paymentMode: 'default',
      paymentMethod: 'boleto',
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
      shippingAddressRequired: false
    }

    for (let index = 0; index < itens.length; index++) {
      billet[`itemId${index + 1}`] = (index + 1).toString().padStart(4, '0')
      billet[`itemQuantity${index + 1}`] = itens[index].itemQuantity
      billet[`itemDescription${index + 1}`] = itens[index].itemDescription
      billet[`itemAmount${index + 1}`] = itens[index].itemAmount
    }
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }

    const parsedBodyContentTypeUrlencodedWwwX = qs.stringify(billet)
    try {
      const { data } = await api.post(`/v2/transactions?email=${sellerEmail}&token=${token}`,
        parsedBodyContentTypeUrlencodedWwwX, headers)
      const convertedData = xmlJs.xml2js(data, { compact: true, spaces: 4 })

      const {
        transaction: {
          date: { _text: date },
          code: { _text: code },
          reference: { _text: bill_reference },
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
          paymentLink: {
            _text: paymentLink
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
            _text: bill_extraAmount
          },
          installmentCount: {
            _text: installmentCount
          },
          itemCount: {
            _text: bill_itemCount
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
      const bill = {
        date,
        code,
        reference: bill_reference,
        type,
        status,
        lastEventDate,
        paymentMethod: {
          type: type_paymentMethod,
          code: code_paymentMethod
        },
        paymentLink,
        grossAmount,
        discountAmount,
        feeAmount,
        netAmount,
        extraAmount: bill_extraAmount,
        installmentCount,
        itemCount: bill_itemCount,
        item: newItems,
        sender: {
          name: sender_name,
          email: sender_email,
          phone: {
            area: sender_area_code,
            number: sender_area_number
          },
          cpf
        }
      }
      return { bill }
    } catch (error) {
      console.log(error)
      return { error: new Error('erro in call message'), info: { message: error.message, status: 401 } }
    }
  }
}
module.exports = CreateSessionIdPagSeguroService
