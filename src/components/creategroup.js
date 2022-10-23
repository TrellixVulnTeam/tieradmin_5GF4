import React, { Fragment, useState, useEffect, useRef } from 'react'
import Breadcrumb from './common/breadcrumb'
import { useQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

import { Routes, Route, Link } from 'react-router-dom'

import {
  Navigation,
  Box,
  MessageSquare,
  Users,
  Briefcase,
  CreditCard,
  ShoppingCart,
  Calendar,
} from 'react-feather'
import CountUp from 'react-countup'
import { Chart } from 'react-google-charts'
import moment from 'moment'
import { Bar, Line } from 'react-chartjs-2'
import {
  lineOptions,
  buyOption,
  employeeData,
  employeeOptions,
} from '../constants/chartData'
// image impoer
import user2 from '../assets/images/dashboard/user2.jpg'
import user1 from '../assets/images/dashboard/user1.jpg'
import man from '../assets/images/dashboard/man.png'
import user from '../assets/images/dashboard/user.png'
import designer from '../assets/images/dashboard/designer.jpg'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Media,
  Row,
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
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardTitle,
  CardText,
} from 'reactstrap'
import classnames from 'classnames'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

const CREATE_EXCELData = gql`
  mutation groupcreate(
    $groupname: String!
    $itemname: String!
    $price: String!
  ) {
    groupcreate(groupname: $groupname, itemname: $itemname, price: $price) {
      id
    }
  }
`

const DELETE_DATA = gql`
  mutation deletegroup($groupname: String!) {
    deletegroup(groupname: $groupname) {
      id
    }
  }
`

const DELETE_GROUP = gql`
  mutation deletegroupbyid($id: Int!) {
    deletegroupbyid(id: $id) {
      id
    }
  }
`

const GET_ORDER = gql`
  query createGroupDatabygroupname($groupname: String!) {
    createGroupDatabygroupname(groupname: $groupname) {
      id
      userId
      groupname
      itemname
      price
    }
  }
`

const ORDER_MUTATION = gql`
  mutation updateOrder($id: Int!, $paidstatus: String!) {
    updateOrder(id: $id, paidstatus: $paidstatus) {
      id
    }
  }
`

const PAID_ORDER_MUTATION = gql`
  mutation createPaidorderlist(
    $userId: Int!
    $productid: Int!
    $title: String!
    $category: String!
    $price: String!
    $discount: String!
    $images: String!
    $wholeamount: String!
    $keepingamount: String!
    $shipping_amount: String!
    $updated_at: String!
    $orderstatus: String!
  ) {
    createPaidorderlist(
      userId: $userId
      productid: $productid
      title: $title
      category: $category
      price: $price
      discount: $discount
      images: $images
      wholeamount: $wholeamount
      keepingamount: $keepingamount
      shipping_amount: $shipping_amount
      updated_at: $updated_at
      orderstatus: $orderstatus
    ) {
      id
    }
  }
`

const Creategroup = () => {
  var node = useRef()
  var arr = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ]

  const [open, setOpen] = useState(false)
  const [opendelete, setOpendelete] = useState(false)
  const [orderdata, setorderdata] = useState()
  // const [itemname, setitemname] = useState()
  // const [itemprice, setitemprice] = useState()

  const [formState, setFormState] = useState({
    itemname: '',
    itemprice: '',
    orderdata: [],
    users: '',
    groupname: 'A',
    id: '',
    time: '9시',
    status: '',
    date: '',
    reservationdetail: '',
  })

  console.log('dfsdf', formState)
  const [orderdatadetail, setorderdatadetail] = useState()
  const [demendata, setdemendata] = useState()

  const [activeTab, setactiveTab] = useState('A')
  // State for current active Tab

  // Toggle active state for Tab

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  var { loading, data } = useQuery(GET_ORDER, {
    variables: {
      groupname: formState.groupname,
    },
    onCompleted: (data) => {
      console.log('data.1111111', data.createGroupDatabygroupname)
      setFormState({
        ...formState,
        orderdata: data.createGroupDatabygroupname,
      })
    },
    onError: (error) => {
      console.log('err', error)
    },
  })
  const onClickDelete = (user) => {
    console.log('user', user)
    setFormState({
      ...formState,
      id: user.id,
      itemname: user.itemname,
    })
    setOpendelete(true)

    // setdeletedata(user)
    // setDeleteModal(true)
  }

  const contactListColumns = [
    {
      text: '그룹명',
      dataField: 'groupname',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '아이템 이름',
      dataField: 'itemname',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '아이템 가격',
      dataField: 'price',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '삭제',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, user) => (
        <div className="d-flex gap-3">
          <Button
            color="primary"
            type="button"
            onClick={() => onClickDelete(user)}
          >
            삭제하기
          </Button>
        </div>
      ),
    },
  ]

  const onOpenModal = () => {
    setOpen(true)
  }

  const startgroupedit = (data) => {
    setOpen(true)
  }

  const onCloseModal = () => {
    setOpen(false)
  }
  const onCloseModaldelete = () => {
    setOpendelete(false)
  }

  const handleChange = (event) => {
    // setitemname(event.target.value);
    setFormState({
      ...formState,
      itemname: event.target.value,
    })
  }

  const handleChangeprice = (event) => {
    setFormState({
      ...formState,
      itemprice: event.target.value,
    })
  }

  const [createexcelmutation, { data2, error2 }] = useMutation(
    CREATE_EXCELData,
    {
      onCompleted: (data2) => {
        window.alert('업데이트 완료')
        window.location.reload()
      },
      onError: (error2) => console.log('error!3', error2),
    },
  )

  const [deletedata, { data22, error22 }] = useMutation(DELETE_DATA, {
    onCompleted: (data22) => {
      console.log('data222', data22)
      window.alert('삭제 완료')
      window.location.reload()
    },
    onError: (error22) => console.log('error!3', error22),
  })

  const [deletedatabyid, { data223, error223 }] = useMutation(DELETE_GROUP, {
    onCompleted: (data223) => {
      console.log('data222', data223)
      window.alert('삭제 완료')
      window.location.reload()
    },
    onError: (error223) => console.log('error!3', error223),
  })

  const startmutation = () => {
    if (Number(formState.itemprice) == 0 || Number(formState.itemprice) == NaN) {
      
      return window.alert('0 이상의 숫자만 입력 가능')
    } else{
      createexcelmutation({
        variables: {
          // datasource:"ddddd"
          groupname: String(formState.groupname),
          itemname: String(formState.itemname),
          price: String(formState.itemprice),
        },
      })
    }
   
  }

  const startdeletemutation = () => {
    deletedata({
      variables: {
        // datasource:"ddddd"
        groupname: String(formState.groupname),
      },
    })
  }

  const startdeletebyidmutation = () => {
    console.log('fffff', formState.id)
    deletedatabyid({
      variables: {
        id: Number(formState.id),
      },
    })
  }

  const handledemend = (arg) => {
    console.log('art,', arg)
    setdemendata(arg)
    if (arg.multiorder.length > 2) {
      setorderdatadetail(JSON.parse(arg.multiorder))
      console.log('data1', JSON.parse(arg.multiorder))
    } else {
      console.log('data2', arg.length)
      setorderdatadetail(arg)
    }

    setOpen(true)
  }

  useEffect(() => {
    console.log('orderdatadetail', orderdatadetail)
  }, [orderdatadetail])

  const [ordercreated, { data: updatedata, error: errordata }] = useMutation(
    ORDER_MUTATION,
    {
      onCompleted: (updatedata) => {
        // window.alert('업데이트가 완료되었습니다')
        // window.location.reload()

        if (orderdatadetail?.length !== undefined) {
          for (let i = 0; i < orderdatadetail?.length; i++) {
            paidordercreated({
              variables: {
                userId: Number(demendata.User.id),
                productid: Number(orderdatadetail[i].id),
                title: String(orderdatadetail[i].title),
                category: String('cate'),
                price: String(orderdatadetail[i].price),
                discount: String(orderdatadetail[i].price),
                images: String(orderdatadetail[i].images),
                wholeamount: String(orderdatadetail[i].qty),
                keepingamount: String(orderdatadetail[i].qtyforkeep),
                shipping_amount: String(
                  Number(orderdatadetail[i].qty) -
                    Number(orderdatadetail[i].qtyforkeep),
                ),
                updated_at: String(Date.now()),
                orderstatus: String('배송준비'),
              },
            })

            // if (e.target.files.length - 1 == i) {
            //   return
            // }
          }
        } else {
          paidordercreated({
            variables: {
              userId: Number(orderdatadetail.User.id),
              productid: Number(orderdatadetail.productid),
              title: String(orderdatadetail.name),
              category: String(orderdatadetail.name),
              price: String(orderdatadetail.item_price),
              discount: String(orderdatadetail.item_price),
              images: String(orderdatadetail.product_main_image),
              wholeamount: String(orderdatadetail.wholeamount),
              keepingamount: String(orderdatadetail.keepingamount),
              shipping_amount: String(orderdatadetail.shipping_amount),
              updated_at: String(Date.now()),
              orderstatus: String('배송준비'),
            },
          })
        }
      },
      onError: (errordata) => {
        window.alert('에러 발생')
        console.log('err', errordata)
      },
    },
  )

  const [paidordercreated, { data: updatedata1, error: errordata1 }] =
    useMutation(PAID_ORDER_MUTATION, {
      onCompleted: (updatedata1) => {
        window.alert('업데이트가 완료되었습니다')
        window.location.reload()
      },
      onError: (errordata1) => {
        window.alert('에러 발생')
        console.log('err', errordata)
      },
    })

  const startupdatemutationfordemend = () => {
    console.log('demendata', demendata)

    if (demendata !== null) {
      if (demendata.paidstatus == 'no') {
        ordercreated({
          variables: {
            id: Number(demendata.id),
            paidstatus: String('yes'),
          },
        })
      } else {
        ordercreated({
          variables: {
            id: Number(demendata.id),
            paidstatus: String('no'),
          },
        })
      }
    }
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle className="h4">그룹 아이템 생성</CardTitle>
          <p className="card-title-desc">
            각 그룹을 선택하여 그룹에 해당하는 아이템을 추가 및 초기화 할 수
            있습니다.
          </p>

          <Nav style={{ cursor: 'pointer' }} tabs>
            {arr &&
              arr.map((item, index) => (
                <NavItem key={index}>
                  <NavLink
                    className={classnames({
                      active: activeTab === item,
                    })}
                    onClick={() => {
                      setFormState({
                        ...formState,
                        groupname: item,
                      })
                      toggle(item)
                    }}
                  >
                    {item}
                  </NavLink>
                </NavItem>
              ))}
          </Nav>

          <TabContent activeTab={activeTab} className="p-3 text-muted">
            {arr.map((item, index) => (
              <>
                <TabPane tabId={item} key={item}>
                  <Row>
                    <Col sm="12">
                      {formState.orderdata.length > 0 ? (
                        <PaginationProvider
                          pagination={paginationFactory({
                            sizePerPage: 500,
                            totalSize: formState.orderdata?.length, // replace later with size(users),
                            custom: true,
                          })}
                          keyField={'id'}
                          columns={contactListColumns}
                          data={formState.orderdata}
                        >
                          {({ paginationProps, paginationTableProps }) => {
                            return (
                              <ToolkitProvider
                                keyField={'id'}
                                data={formState.orderdata}
                                columns={contactListColumns}
                                bootstrap4
                                search
                              >
                                {(toolkitProps) => (
                                  <React.Fragment>
                                    <Row className="mb-2">
                                      <Col sm="4">
                                        <div className="search-box ms-2 mb-2 d-inline-block">
                                          <div className="position-relative">
                                            <i className="bx bx-search-alt search-icon" />
                                          </div>
                                        </div>
                                      </Col>
                                      <Col sm="8"></Col>
                                    </Row>
                                    <Row>
                                      <Col xl="12">
                                        <div className="table-responsive">
                                          <BootstrapTable
                                            keyField={'id'}
                                            {...toolkitProps.baseProps}
                                            {...paginationTableProps}
                                            defaultSorted={[
                                              {
                                                dataField: 'id', // if dataField is not match to any column you defined, it will be ignored.
                                                order: 'desc', // desc or asc
                                              },
                                            ]}
                                            classes={
                                              'table align-middle table-bordered table-hover text-centered'
                                            }
                                            bordered={false}
                                            striped={false}
                                            responsive
                                            ref={node}
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row className="align-items-md-center mt-30">
                                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                                        <PaginationListStandalone
                                          {...paginationProps}
                                        />
                                      </Col>
                                    </Row>
                                    ,
                                  </React.Fragment>
                                )}
                              </ToolkitProvider>
                            )
                          }}
                        </PaginationProvider>
                      ) : (
                        <div>등록된 데이터가 없습니다.</div>
                      )}
                      <Button onClick={() => startgroupedit(item)}>
                        {item} 그룹 아이템 생성
                      </Button>
                      <Button
                        color="primary"
                        style={{ marginLeft: '10px' }}
                        onClick={() => startdeletemutation()}
                      >
                        {item} 그룹 아이템 초기화
                      </Button>
                    </Col>
                  </Row>
                </TabPane>
              </>
            ))}
          </TabContent>
        </CardBody>
      </Card>

      <>
        {formState && (
          <>
            <Modal
              isOpen={opendelete}
              toggle={onCloseModaldelete}
              style={{ overlay: { opacity: 0.1 } }}
            >
              <ModalBody>
                <Label htmlFor="recipient-name" className="col-form-label">
                  {formState.itemname} 을(를) 삭제하시겠습니까?
                </Label>

                {/* <Input type="text"  readOnly  className="form-control" /> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="primary"
                  onClick={() => startdeletebyidmutation()}
                >
                  삭제
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => onCloseModaldelete('VaryingMdo')}
                >
                  닫기
                </Button>
              </ModalFooter>
            </Modal>
            <Modal
              isOpen={open}
              toggle={onCloseModal}
              style={{ overlay: { opacity: 0.1 } }}
            >
              <ModalHeader toggle={onCloseModal}>
                <h5 className="modal-title f-w-600" id="exampleModalLabel2">
                  그룹 아이템 생성
                </h5>
              </ModalHeader>
              <ModalBody>
                <Label htmlFor="recipient-name" className="col-form-label">
                  아이템 이름 :
                </Label>
                <Input
                  className="touchspin form-control"
                  type="text"
                  value={formState.itemname}
                  onChange={handleChange}
                />
                <Label htmlFor="recipient-name" className="col-form-label">
                  가격(숫자만 입력, 예)5만원일 경우 50000 입력) :
                </Label>
                <Input
                  className="touchspin form-control"
                  type="number"
                  value={formState.itemprice}
                  onChange={handleChangeprice}
                />
                {/* <Input type="text"  readOnly  className="form-control" /> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="button"
                  color="primary"
                  onClick={() => startmutation()}
                >
                  저장
                </Button>
                <Button
                  type="button"
                  color="secondary"
                  onClick={() => onCloseModal('VaryingMdo')}
                >
                  닫기
                </Button>
              </ModalFooter>
            </Modal>
          </>
        )}
      </>
    </Fragment>
  )
}

// javascript:void(0)

export default Creategroup
