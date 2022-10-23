import React, { Fragment, useEffect, useState } from 'react'
import Breadcrumb from '../common/breadcrumb'
import data from '../../assets/data/orders'
import Datatable from '../common/datatable'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Media,
  Table,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'
import { useParams } from 'react-router-dom'
import { useQuery, useLazyQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import moment from 'moment'
import { Link } from 'react-router-dom'

const GET_ORDER = gql`
  query ordersbyorderid($id: Int!) {
    ordersbyorderid(id: $id) {
      id
      createdAt
      product_main_image
      name
      keepingamount
      wholeamount
      multiorder
      shipping_amount
      created_at
      updated_at
      item_price
      paidstatus
      userId
    }
  }
`

const Orders = (props) => {
  const imgStyle = {
    maxHeight: 128,
  }
  console.log('props', props.match.params.id)
  const handle = useParams()
  const [open, setOpen] = useState(false)
  const [orderdataid, setorderdataid] = useState()
  const [orderdata, setorderdata] = useState()
  const [orderdatadetail, setorderdatadetail] = useState()
  const [formState, setFormState] = useState({
    id: '',
    users: '',
  })
  const onOpenModal = () => {
    setOpen(true)
  }

  const onCloseModal = () => {
    setOpen(false)
  }

  var { loading, data } = useQuery(GET_ORDER, {
    variables: {
      id: Number(props.match.params.id),
    },
    onCompleted: (data) => {
      console.log('detaildata', data)
      if (data.ordersbyorderid[0].multiorder.length > 2) {
        setorderdata(data.ordersbyorderid[0])
        setorderdatadetail(JSON.parse(data.ordersbyorderid[0].multiorder))
        console.log('data1', JSON.parse(data.ordersbyorderid[0].multiorder))
      } else {
        console.log('data2')
        setorderdata(data.ordersbyorderid[0])
      }
    },
    onError: (error) => {
      console.log('err', error)
    },
  })

  // const [getData, { loading, data, error }] = useLazyQuery(GET_ORDER, {
  //   variables: {
  //     id: Number(8),
  //   },
  //   onCompleted: (data) => {
  //     console.log('data!322', data)
  //   },
  //   onError: (error) => {
  //     console.log('error!311', error)
  //   },
  // })

  return (
    <Fragment>
      <Breadcrumb title="Orders" parent="Sales" />

      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                <h5>Manage Order</h5>
              </CardHeader>
              <CardBody className="order-datatable">
                {orderdata && (
                  <>
                    <Modal
                      isOpen={open}
                      toggle={onCloseModal}
                      style={{ overlay: { opacity: 0.1 } }}
                    >
                      <ModalHeader toggle={onCloseModal}>
                        <h5
                          className="modal-title f-w-600"
                          id="exampleModalLabel2"
                        >
                          Edit Product
                        </h5>
                      </ModalHeader>
                      <ModalBody>
                        <Form>
                          <FormGroup>
                            <Label
                              htmlFor="recipient-name"
                              className="col-form-label"
                            >
                              Category Name :
                            </Label>
                            <Input type="text" className="form-control" />
                          </FormGroup>
                          <FormGroup>
                            <Label
                              htmlFor="message-text"
                              className="col-form-label"
                            >
                              Category Image :
                            </Label>
                            <Input
                              className="form-control"
                              id="validationCustom02"
                              type="file"
                            />
                          </FormGroup>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          type="button"
                          color="primary"
                          onClick={() => onCloseModal('VaryingMdo')}
                        >
                          Update
                        </Button>
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => onCloseModal('VaryingMdo')}
                        >
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <section className="section-b-space light-layout">
                      <Container>
                        <Row>
                          <Col md="12">
                            <div
                              className="success-text text-left"
                              style={{
                                fontWeight: 'bold',
                              }}
                            >
                              {/* <i className="fa fa-check-circle" aria-hidden="true"></i> */}

                              <p>
                                주문날짜 -
                                {moment(new Date(orderdata.createdAt)).format(
                                  'YYYY-MM-DD-A hh:mm',
                                )}
                              </p>
                              <p>
                                주문번호 - {props.match.params.id}번{}
                              </p>

                              <p>
                                입금확인 -{' '}
                                {orderdata.paidstatus == 'no'
                                  ? '확인전'
                                  : '확인완료'}
                                {}
                              </p>

                              {console.log('result', orderdatadetail)}
                            </div>

                            {orderdatadetail !== undefined ? (
                           
                                <Table
                                  className="table mb-0"
								  style={{ fontSize: '15px', verticalAlign:"middle !important" }}
                                >
                                  <thead>
                                    <tr>
                                      <th>이미지</th>
                                      <th>상품명</th>
                                      <th>키핑수량</th>
                                      <th>발송요청수량</th>
                                      <th>총 수량</th>
                                     
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {orderdatadetail !== undefined &&
                                      orderdatadetail.map((item, index) => (
                                        <tr key={index}>
                                          <td>
                                            {' '}
                                            <Link
                                              href={
                                                `/left-sidebar/product/` +
                                                item.id
                                              }
                                            >
                                              <a
                                                style={{
                                                  height: '90px !important',
                                                }}
                                              >
                                                <Media
                                                  style={imgStyle}
                                                  src={
                                                    item.images
                                                      ? JSON.parse(
                                                          item.images,
                                                        )[0]
                                                      : JSON.parse(
                                                          item.images,
                                                        )[0]
                                                  }
                                                  alt=""
                                                />
                                              </a>
                                            </Link>
                                          </td>
                                          <th
                                            scope="row"
                                            className="drag-pointer"
                                          >
                                            {item.title}
                                          </th>

                                          <td> {item.qtyforkeep}개</td>
                                          <td>
                                            {' '}
                                            {Number(item.qty) -
                                              Number(item.qtyforkeep)}
                                            개
                                          </td>
                                          <td> {item.qty}개</td>
                                        
                                        </tr>
                                      ))}
                                  </tbody>
                                </Table>
                       
                            ) : (
                              <>
                            
                                  <Table
                                    className="table mb-0"
                                    style={{ fontSize: '15px', verticalAlign:"middle !important" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th>이미지</th>
                                        <th>상품명</th>
                                        <th>키핑수량</th>
                                        <th>발송요청수량</th>
                                        <th>총 수량</th>
									
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        {console.log(
                                          'JSON.parse(orderdata.product_main_image)[0]',
                                          orderdata.product_main_image,
                                        )}
                                        <td>
                                          {' '}
                                          <Link
                                            href={
                                              `/left-sidebar/product/` +
                                              orderdata.id
                                            }
                                          >
                                            <a
                                              style={{
                                                height: '90px !important',
                                              }}
                                            >
                                              <Media
                                                style={imgStyle}
                                                src={
                                                  orderdata.product_main_image !==
                                                  ''
                                                    ? JSON.parse(
                                                        orderdata?.product_main_image,
                                                      )[0]
                                                    : ''
                                                }
                                                alt=""
                                              />
                                              {/* <Media
                                        style={imgStyle}
                                        src={
                                            orderdata.product_main_image
                                            ? JSON.parse(orderdata?.product_main_image)[0]
                                            : JSON.parse(orderdata.product_main_image)[0]
                                        }
                                        alt=""
                                      /> */}
                                            </a>
                                          </Link>
                                        </td>
                                        <th
                                          scope="row"
                                          className="drag-pointer"
                                        >
                                          {orderdata.name}
                                        </th>

                                        <td> {orderdata.keepingamount}개</td>
                                        <td>
                                          {' '}
                                          {Number(orderdata.wholeamount) -
                                            Number(orderdata.keepingamount)}
                                          개
                                        </td>
                                        <td> {orderdata.wholeamount}개</td>

									
										
                                      </tr>
                                    </tbody>
                                  </Table>
                              
                              </>
                            )}
                          </Col>
                        </Row>
                      </Container>
                    </section>
                  </>
                )}
                {/* <Datatable
                  multiSelectOption={false}
                  myData={data}
                  pageSize={10}
                  pagination={true}
                  class="-striped -highlight"
                /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

export default Orders
