import React, { Fragment, useState } from 'react'
import Breadcrumb from '../common/breadcrumb'
import data from '../../assets/data/sales-transactions'
import Datatable from '../common/datatable'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Label,
  Input,Media
} from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useQuery, useLazyQuery } from '@apollo/client'
import { gql } from '@apollo/client'

const GET_ORDER = gql`
  query paidorderbyid($id: Int!) {
    paidorderbyid(id: $id) {
      id
      createdAt
      wholeamount
      userId
      title
      category
      price
      discount
      images
      updated_at
      productid
      wholeamount
      keepingamount
      shipping_amount
      orderstatus
      User {
        id
        email
        name
      }
    }
  }
`

const Transactions_sales = (props) => {
	const imgStyle = {
		maxHeight: 128,
	  }
  const [orderdata, setorderdata] = useState()

  var { loading, data } = useQuery(GET_ORDER, {
    variables: {
      id: Number(props.match.params.id),
    },
    onCompleted: (data) => {
      console.log('data.', data)
      setorderdata(data.paidorderbyid[0])
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  // User: {__typename: 'User', id: 2, email: 'with317@gmail.com', name: 'testkim'}
  // category: "[특별기획]스포츠레깅스 \n"
  // createdAt: "2022-05-10T06:42:56.604Z"
  // discount: "53999"
  // id: 43
  // images: "[\"https://yoyomobucket.s3.ap-northeast-2.amazonaws.com/293093fb-b01a-4593-b92f-56fca73264ad.jpeg\"]"
  // keepingamount: "2"
  // orderstatus: "배송준비"
  // price: "53999"
  // productid: 0
  // shipping_amount: "5"
  // title: "[특별기획]스포츠레깅스 \n"
  // updated_at: "1652164976578"
  // userId: 2
  // wholeamount: "7"

  return (
    <Fragment>
      <Breadcrumb title="입금확정 목록" parent="Sales" />

      <Container fluid={true}>
        {orderdata && (
          <Row>
            <Col sm="12">
              <Card>
                <CardHeader>
                  <h5>확정목록</h5>
                </CardHeader>
                <CardBody>
                  <h5 className="f-w-600 f-16">상품 이미지</h5>
                  <Label className="d-block">
                    <Media
                      style={imgStyle}
                      src={
                        orderdata.images
                          ? JSON.parse(orderdata.images)[0]
                          : JSON.parse(orderdata.images)[0]
                      }
                      alt=""
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">상품명</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={orderdata.title}
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">구매자</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={orderdata.User.name}
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">개당 금액</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={
                        Number(orderdata.price)
                          .toFixed(0)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
                      }
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">총 금액</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={
                        (
                          Number(orderdata.price) *
                          Number(orderdata.wholeamount)
                        )
                          .toFixed(0)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
                      }
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">총 구매갯수</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={orderdata.wholeamount + '개'}
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">키핑갯수</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={orderdata.keepingamount + '개'}
                    />
                  </Label>
                  <h5 className="f-w-600 f-16">발송요청 개수</h5>
                  <Label className="d-block">
                    <Input
                      className="checkbox_animated"
                      id="chk-ani1"
                      type="input"
                      readOnly
                      defaultValue={orderdata.shipping_amount + '개'}
                    />
                  </Label>
                  {/* <div id="batchDelete" className="transactions">
							<Datatable
								multiSelectOption={false}
								myData={data}
								pageSize={10}
								pagination={true}
								class="-striped -highlight"
							/>
						</div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </Fragment>
  )
}

export default Transactions_sales
