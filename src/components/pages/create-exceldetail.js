import React, { useEffect, useState, useRef } from 'react'
import { map, _ } from 'lodash'
import MetaTags from 'react-meta-tags'
import * as AWS from 'aws-sdk'
// import XLSX from 'xlsx'
import * as XLSX from 'xlsx'
import Breadcrumb from '../common/breadcrumb'
import { v4 as uuidv4 } from 'uuid'
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  Input,
  Label,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  ModalHeader,
  ModalBody,
  CardTitle,
  CardHeader,
  Modal,
  Table,
  FormGroup,
} from 'reactstrap'
import classnames from 'classnames'

import { Editor } from '@tinymce/tinymce-react'

import { gql, useMutation, useQuery } from '@apollo/client'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'
import DataTable from 'react-data-table-component'

const CREATE_EXCELData = gql`
  mutation createExcelDate($datasource: String!, $userId: Int!, $adminId: Int!) {
    createExcelDate(datasource: $datasource, userId: $userId, adminId: $adminId) {
      id
    }
  }
`

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      email
    }
  }
`

const CREACT_PRODUCT_MUTATION = gql`
  mutation createProduct(
    $title: String
    $description: String
    $type: String
    $brand: String
    $category: String
    $price: Int
    $newproduct: String
    $sale: String
    $stock: String
    $discount: Int
    $variants: String
    $images: String
    $userId: Int
    $productpageId: Int
  ) {
    createProduct(
      title: $title
      description: $description
      type: $type
      brand: $brand
      category: $category
      price: $price
      newproduct: $newproduct
      sale: $sale
      stock: $stock
      discount: $discount
      variants: $variants
      images: $images
      userId: $userId
      productpageId: $productpageId
    ) {
      userId
    }
  }
`
const GET_USERBYID = gql`
  mutation userbyid($id: Int!) {
    userbyid(id: $id) {
      id
      name
      company
    }
  }
`

const Create_exceldetail = (props) => {
  console.log('props', props.match.params.id)
  var node = useRef()
  const [startDate, setStartDate] = useState(new Date())
  const [testarr, settestarr] = useState([])
  const [collectsource, setcollectsource] = useState('not selected')

  const [contentvalue, setcontentvalue] = useState('')
  const [imageCenterModal, setImageCenterModal] = useState(false)

  const [formStateimage, setFormStateimage] = useState([])
  const [status, setstatus] = useState()
  const [exceldata, setexceldata] = useState()
  const [cols, setcols] = useState()

  const [finalarray, setfinalarray] = useState()
  const [tabledate, settabledate] = useState()
  const [s3imagesforup, sets3imagesforup] = useState([])
  const [activeTab, setactiveTab] = useState('1')

  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('0')

  // Toggle active state for Tab
  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab)
  }

  //   const {
  //     loading,
  //     error: error3,
  //     data: medata,
  //   } = useQuery(DATA_QUERY2, {

  //     fetchPolicy: "network-only",
  //     onCompleted: medata => {
  //       if (medata) {
  //         console.log("df", medata.Termsanduses[0]?.contents)
  //         setstatus(medata.Termsanduses[0]?.contents)
  //       }
  //     },
  //     onError: error3 => {
  //       console.log("error!3", error)
  //     },
  //   })

  const [formState, setFormState] = useState({
    id: 0,
    productImages: [],
    descriptionHTMLContent: '',
    title: '',
    description: '',
    type: '',
    brand: '',
    category: '',
    price: 0,
    newproduct: '',
    sale: '',
    stock: '',
    discount: 0,
    variants: '',
    images: '',
    userId: 0,
    productpageId: 0,
    adminuserinfo: '',
  })
  const [imageCenterFormState, setImageCenterFormState] = useState({
    startDate: null,
    endDate: null,
    page: 1,
    size: 20,
    selectedIds: [],
  })

  var typename

  const handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    var wbfirst
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      console.log(rABS, wb)
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      /* Update state */
      // this.setState({ data: data, cols: make_cols(ws['!ref']) })
      setexceldata(wb)
      setcols(wb.SheetNames)

      // setcols(make_cols(ws['!ref']))
    }
    if (rABS) {
      reader.readAsBinaryString(file)
      console.log('test1', wbfirst)
    } else reader.readAsArrayBuffer(file)
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const make_cols = (refstr) => {
    let o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1
    for (var i = 0; i < C; ++i)
      o[i] = { name: XLSX.utils.encode_col(i), key: i }
    return o
  }
  const [getuserbyid, { data2231, error2231 }] = useMutation(GET_USERBYID, {
    onCompleted: (data2231) => {
      console.log('dddd', data2231)
      setFormState({
        ...formState,
        adminuserinfo: data2231.userbyid,
      })
    },
    onError: (error223) => {
      console.log('error!3', error2231)
      window.alert('에러 발생')
    },
  })

  useEffect(() => {
    if (Number(props.match.params.id) > 0) {
      getuserbyid({
        variables: {
          id: Number(props.match.params.id),
        },
      })
    }
  }, [props.match.params.id])
  const SheetJSFT = [
    'xlsx',
    'xlsb',
    'xlsm',
    'xls',
    'xml',
    'csv',
    'txt',
    'ods',
    'fods',
    'uos',
    'sylk',
    'dif',
    'dbf',
    'prn',
    'qpw',
    '123',
    'wb*',
    'wq*',
    'html',
    'htm',
  ]
    .map(function (x) {
      return '.' + x
    })
    .join(',')

  const { error, data } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      console.log('data!3', data.me.id)
      setFormState({
        ...formState,
        id: data.me.id,
      })
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })

  const [createexcelmutation, { data2, error2 }] = useMutation(
    CREATE_EXCELData,
    {
      onCompleted: (data2) => {
        window.alert('업데이트 완료')
        console.log('ddddd', data2)
        window.location.reload()
      },
      onError: (error2) => console.log('error!3', error2),
    },
  )

  const [productCReate] = useMutation(CREACT_PRODUCT_MUTATION, {
    onError: (error5) => {
      console.log('error5', error5)

      // window.location.reload();
    },
    onCompleted: (data5) => {
      console.log('data5', data5)
    },
  })

  const startmutation = () => {
    createexcelmutation({
      variables: {
        userId: Number(formState.adminuserinfo.id),
        datasource: String(JSON.stringify(finalarray)),
        adminId: Number(formState.adminuserinfo.id),
      },
    })
  }

  const startcreateproductmutation = () => {
    console.log('formstate11', formState)
    productCReate({
      variables: {
        title: String(formState.title),
        description: String(formState.descriptionHTMLContent),
        type: 'none',
        brand: String(formState.brand),
        category: String(formState.category),
        price: Number(formState.price),
        newproduct: 'none',
        sale: String(formState.sale),
        stock: String(formState.stock),
        discount: Number(formState.discount),
        variants: String(formState.variants),
        images: JSON.stringify(s3imagesforup),
        userId: Number(formState.id),
        productpageId: 1,
      },
    })
  }

  var arr

  var jsonArray = new Array()

  var jsonObj = new Object()
  var jsonArrayfianl = new Array()

  var jsonObjfianl = new Object()

  var realfinalarray = new Array()

  var realfinalobj = new Object()

  useEffect(() => {
    console.log('tabledate', tabledate)
  }, [tabledate])

  useEffect(() => {
    if (exceldata !== undefined) {
      var test2 = exceldata.Sheets

      var after1
      var after2

      var changevalue

      after1 = Object.values(test2)[0]
      after2 = Object.keys(after1)
      var superafter

      var result = after2.filter((w) => w.startsWith('C'))
      //c열 포함 출력

      for (let i = 0; i < Object.keys(test2).length; i++) {
        // console.log('exceldata31', Object.keys(test2)[i])
        jsonObj = {}
        jsonArray = []

        changevalue = Object.values(test2)[i]

        var finalarray1

        finalarray1 = Object.entries(changevalue)

        if (i > 0 && jsonArrayfianl !== []) {
          realfinalobj.셀이름 = typename
          realfinalobj.밸류 = jsonArrayfianl
          realfinalarray.push(realfinalobj)

          realfinalobj = {}
          jsonArrayfianl = []
        }

        // for (var j=0; j< Object.keys(changevalue).filter((w) => w.startsWith('C')).length - 1; j++) {
        for (var j = 0; j < Object.entries(changevalue).length; j++) {
          jsonObj = {}

          if (
            Object.entries(changevalue)[j][0].startsWith('C') ||
            Object.entries(changevalue)[j][0].startsWith('D') ||
            Object.entries(changevalue)[j][0].startsWith('J') ||
            Object.entries(changevalue)[j][0].startsWith('K') ||
            Object.entries(changevalue)[j][0].startsWith('L') ||
            Object.entries(changevalue)[j][0].startsWith('M')
          ) {
            jsonObj.셀이름 = Object.entries(changevalue)[j][0]
            jsonObj.밸류 = Object.entries(changevalue)[j][1].v
            jsonArray.push(jsonObj)
          }

          if (Object.entries(changevalue).length - 1 == j) {
            var name = Object.keys(test2)[i]

            for (var k = 0; k < jsonArray.length; k++) {
              if (jsonArray[k].셀이름.startsWith('C')) {
                jsonObjfianl.코드 = jsonArray[k].밸류
              }
              if (jsonArray[k].셀이름.startsWith('L')) {
                console.log('dfsdfsfsd')
                jsonObjfianl.id = jsonArray[k].밸류
              }
              if (jsonArray[k].셀이름.startsWith('D')) {
                jsonObjfianl.이름 = jsonArray[k].밸류
              }
              if (jsonArray[k].셀이름.startsWith('J')) {
                jsonObjfianl.가격 = jsonArray[k].밸류
              }
              if (jsonArray[k].셀이름.startsWith('K')) {
                jsonObjfianl.할인율 = jsonArray[k].밸류
              }
              if (jsonArray[k].셀이름.startsWith('M')) {
                jsonObjfianl.그룹 = jsonArray[k].밸류
              }
              if (k % 6 == 5) {
                jsonArrayfianl.push(jsonObjfianl)
                jsonObjfianl = {}
                typename = Object.keys(test2)[i]
              }

              // if (k % 3 == 0){

              // }
            }
          }
        }

        // "users":[
        //   {
        //     "id": 1,
        //     "name": "paul"
        //   },
        //   {
        //     "id": 1,
        //     "name": "paul"
        //   }
        // ]

        //c7은 코드, 그 이후에는 실제 코드들이므로 c 를 포함한 모든 갯수에서 1을 뺀 값이 총 열의 갯수가 됨
        //즉 , 각각의 열의 갯수
        if (Object.keys(test2).length - 1 == i) {
          realfinalobj.셀이름 = typename
          realfinalobj.밸류 = jsonArrayfianl
          realfinalarray.push(realfinalobj)

          realfinalobj = {}
          jsonArrayfianl = []

          return setfinalarray(realfinalarray)
        }
      }

      //c7은 코드, 그 이후에는 실제 코드들이므로 c 를 포함한 모든 갯수에서 1을 뺀 값이 총 열의 갯수가 됨
    }
  }, [exceldata])

  const config = {
    bucketName: process.env.REACT_APP_S3_BUCKETNAME,
    region: process.env.REACT_APP_S3_BUCKETREGION,
    // accessKeyId: process.env.REACT_S3_ACCESSKEYID,
    accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
    secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
  }

  const s3 = new AWS.S3({
    region: process.env.REACT_APP_S3_BUCKETNAME,
    accessKeyId: process.env.REACT_APP_S3_ACCESSKEYID,
    secretAccessKey: process.env.REACT_APP_S3_SECRETACCESSKEY,
  })

  const uploadToS3 = async (data) => {
    let name = uuidv4() + '.' + data.type.substring(6)

    await s3
      .putObject({
        Key: name,
        Bucket: 'tireprobuck',
        // ContentType: "image/jpeg",
        ContentType: data.type,
        Body: data,
        ACL: 'public-read',
      })
      .promise()
    return `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${name}`
  }

  const uploadFile = async (e) => {
    try {
      if (e.target.files.length > 0) {
        for (let i = 0; i < e.target.files.length; i++) {
          // uploadFile1(s3images1[i], s3images1[i]);
          const url = await uploadToS3(e.target.files[i])
          const url2 = await sets3imagesforup((prevImages) =>
            prevImages.concat(url),
          )
          const urlbefore = await [
            {
              fileName: e.target.files[i].name,
              image: url,
              id: uuidv4() + '.' + e.target.files[i].type.substring(6),
            },
          ]
          const url3 = await setFormStateimage((formStateimage) =>
            formStateimage.concat(urlbefore),
          )
          if (e.target.files.length - 1 == i) {
            return
          }
        }
      } else {
        const url = await uploadToS3(e.target.files[0])

        sets3imagesforup((prevImages) => prevImages.concat(url))
      }

      // const url = await uploadToS3(e.target.files[0])
      // console.log("url", url)
      // sets3imagesforup((prevImages) => prevImages.concat(url));
      // res = ""
    } catch (error) {
      window.alert(
        '업로드 도중 오류가 발생하였습니다. 잠시 후 다시 시도 부탁드립니다.',
        error,
      )
    }
  }

  console.log(formState, 'formstart')

  const contactListColumns = [
    {
      text: 'id',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '코드',
      dataField: '코드',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '이름',
      dataField: '이름',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '가격',
      dataField: '가격',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '할인율',
      dataField: '할인율',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '그룹',
      dataField: '그룹',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
  ]
  const { SearchBar } = Search
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>관리자 페이지 </title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="엑셀 업로드" parent="Pages" />
          <h5> 성함 - {formState.adminuserinfo?.name}</h5>

          <h5>
            {' '}
            사업자 명 - {formState.adminuserinfo?.company?.split('///')[0]}
          </h5>
          <h5>
            {' '}
            사업자 주소 - {formState.adminuserinfo?.company?.split('///')[1]}
          </h5>
          <Col xs={12}>
            <Label className="col-xl-3 col-md-4">
              <span>*</span>엑셀 업로드
            </Label>

            <input
              type="file"
              className="form-control"
              id="file"
              accept={SheetJSFT}
              onChange={handleChange}
            />
          </Col>

          <div
            style={{
              display: 'block',
              // width: 700,
              // padding: 30,
              cursor: 'pointer',
            }}
          >
            <br />
            <h4>엑셀 미리보기</h4>
            {console.log('dddd', JSON.stringify(finalarray))}
            <br />
            <>
              <Nav tabs>
                {finalarray &&
                  finalarray.map((item, index) => (
                    <NavItem key={index}>
                      <NavLink
                        className={classnames({
                          active: currentActiveTab === index,
                        })}
                        onClick={() => {
                          toggle(index)
                          settabledate(item.밸류)
                          console.log('ddddd', index)
                        }}
                      >
                        {item.셀이름}
                      </NavLink>
                    </NavItem>
                  ))}
              </Nav>
              <TabContent activeTab={currentActiveTab}>
                {finalarray &&
                  finalarray.map((item, index) => (
                    <TabPane tabId={index} key={index}>
                      <Row>
                        <Col sm="12">
                          <br />
                          <h5>엑셀내용 상세</h5>

                          <br />
                          {tabledate && (
                            <PaginationProvider
                              pagination={paginationFactory({
                                sizePerPage: 500,
                                totalSize: tabledate.length, // replace later with size(users),
                                custom: true,
                              })}
                              keyField={'id'}
                              columns={contactListColumns}
                              data={tabledate}
                            >
                              {({ paginationProps, paginationTableProps }) => {
                                return (
                                  <ToolkitProvider
                                    keyField={'id'}
                                    data={tabledate}
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
                                                {/* <SearchBar
                                                  {...toolkitProps.searchProps}
                                                /> */}
                                                {`총 갯수 =  ${
                                                  tabledate.length - 1
                                                }개`}

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
                          )}
                        </Col>
                        <Button
                          color="primary"
                          type="button"
                          onClick={() => startmutation()}
                        >
                          저장하기
                        </Button>
                      </Row>
                    </TabPane>
                  ))}
              </TabContent>
            </>
          </div>

          <Modal isOpen={imageCenterModal}>
            <Card>
              {/* <CardHeader style={{ backgroundColor: "#5e72e4" }}> */}
              <CardHeader>
                <button
                  aria-label="Close"
                  className="close float-right"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setImageCenterModal(false)}
                >
                  <span className="text-white" aria-hidden>
                    ×
                  </span>
                </button>
              </CardHeader>
              <CardBody>
                <CardTitle className="mb-3">상품 기본 정보</CardTitle>
                <Input
                  className="form-control form-control-lg"
                  id="formFileLg"
                  type="file"
                  name="file"
                  multiple
                  onChange={uploadFile}
                  ref={node}
                />

                <Container fluid>
                  <Row
                    style={{
                      marginTop: '15px',
                    }}
                  ></Row>
                </Container>
                {/* <h5 className="mt-5">
              {imageCenterFormState.selectedIds.length} 개 선택 됨
            </h5> */}
                {imageCenterFormState.selectedIds.length > 0 ? (
                  <Button
                    className="float-right"
                    color="success"
                    onClick={() => {
                      if (imageCenterFormState.position === 'mainImage') {
                        formStateimage &&
                          setFormState({
                            ...formState,
                            productImages: _.uniq([
                              ...formState.productImages,
                              ...formStateimage
                                .filter((filterData) =>
                                  imageCenterFormState.selectedIds.includes(
                                    filterData.id,
                                  ),
                                )
                                .map((imageData) => imageData.image),
                            ]),
                          })
                        // imageAddSuccess()
                        setImageCenterModal(false)
                        setImageCenterFormState({
                          ...imageCenterFormState,
                          position: null,
                          selectedIds: [],
                        })
                      }

                      if (imageCenterFormState.position === 'textEdit') {
                        const imageList = formStateimage
                          .filter((filterDate) =>
                            imageCenterFormState.selectedIds.includes(
                              filterDate.id,
                            ),
                          )
                          .map((imageDate) => imageDate.image)

                        if (imageList.length > 0) {
                          console.log('imgae', imageList)
                          //   setFormState({
                          //     ...formState,
                          //     descriptionHTML: formState.descriptionHTMLContent
                          //       ? `${formState.descriptionHTMLContent}<img src="${imageList[0]}" />`
                          //       : `<img src="${imageList[0]}" />`,
                          //   })
                          setFormState({
                            ...formState,
                            descriptionHTMLContent:
                              formState.descriptionHTMLContent
                                ? `${formState.descriptionHTMLContent}<img src=${imageList[0]} />`
                                : `<img src=${imageList[0]} />`,
                          })

                          // setFormState({
                          // 	...formState,
                          // 	descriptionHTMLContent: `${formState.descriptionHTMLContent}`

                          //   })
                        }
                      }
                    }}
                  >
                    추가하기
                  </Button>
                ) : (
                  <></>
                )}
              </CardBody>
            </Card>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default Create_exceldetail
