import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs'
import { User, Settings } from 'react-feather'
import { Button, Col, Input, Label, Row, Table, FormGroup } from 'reactstrap'
import { gql } from '@apollo/client'

import { useQuery, useMutation } from '@apollo/client'
import paginationFactory, {
  PaginationListStandalone,
  PaginationProvider,
} from 'react-bootstrap-table2-paginator'
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit'
import BootstrapTable from 'react-bootstrap-table-next'

const ME_QUERY = gql`
  query me {
    me {
      id
      name
      email
      businesscard
      company
    }
  }
`
const UPDATE_MUTATION = gql`
  mutation updateadmininfo($id: Int!, $company: String) {
    updateadmininfo(id: $id, company: $company) {
      id
    }
  }
`


const TabsetProfile = () => {
  var node = useRef()
  const [formState, setFormState] = useState({
    users: [],
    companyaddr: '',
    companyname: '',
  })
  const { error, data: datame } = useQuery(ME_QUERY, {
    onCompleted: (datame) => {
      console.log('data!3', datame.me)
      setFormState({
        ...formState,
        id: datame.me.id,
        users: [datame.me],
        companyaddr: datame.me.company.split('///')[1],
        companyname: datame.me.company.split('///')[0],
      })
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })
  const contactListColumns = [
    {
      text: 'name',
      dataField: 'name',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: 'email',
      dataField: 'email',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
    },
    {
      text: '사업자등록증',
      dataField: 'businesscard',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">
          <a href={item.businesscard} target="_blank">
            보기
          </a>{' '}
        </div>
      ),
    },

    {
      text: '지점 이름',
      dataField: 'company',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">{item?.company?.split('///')[0]}</div>
      ),
    },
    {
      text: '지점 주소',
      dataField: 'id',
      sort: true,
      headerStyle: {
        backgroundColor: '#f8f9fa',
      },
      formatter: (cellContent, item) => (
        <div className="d-flex gap-3">{item?.company?.split('///')[1]}</div>
      ),
    },
  ]

  const [updateUser, { data: updatedata1, error: errordata1 }] = useMutation(
    UPDATE_MUTATION,
    {
      onCompleted: (updatedata1) => {
        window.alert('업데이트가 완료되었습니다')
        window.location.reload()
      },
      onError: (errordata1) => {
        window.alert('에러 발생')
        console.log('err', errordata1)
      },
    },
  )




  const startmutaion = () => {
    if (formState.companyaddr.length < 1 || formState.companyname.length < 1) {
      return window.alert('공백을 채워주세요')
    } else {
      updateUser({
        variables: {
          id: Number(formState.id),
          company:
            String(formState.companyname) +
            '///' +
            String(formState.companyaddr),
        },
      })
    }

    // console.log('demendata', formState.company.split('///')[0])
    // console.log('demendata', formState.company.split('///')[1])

    // if (formState.company !== null) {
    //   if (demendata.paidstatus == 'no') {
    //     ordercreated({
    //       variables: {
    //         id: Number(demendata.id),
    //         paidstatus: String('yes'),
    //       },
    //     })
    //   } else {
    //     ordercreated({
    //       variables: {
    //         id: Number(demendata.id),
    //         paidstatus: String('no'),
    //       },
    //     })
    //   }
    // }
  }

  console.log('fom', formState)

  return (
    <div>
      <Tabs>
        <TabList className="nav nav-tabs tab-coupon">
          <Tab className="nav-link">
            <User className="mr-2" />
            프로필 보기
          </Tab>
          <Tab className="nav-link">
            <Settings className="mr-2" />
            프로필 수정하기
          </Tab>
        </TabList>

        <TabPanel>
          <div className="tab-pane fade show active">
            <h5 className="f-w-600 f-16">Profile</h5>
            <div className="table-responsive profile-table">
              {formState.users?.length > 0 && (
                <PaginationProvider
                  pagination={paginationFactory({
                    sizePerPage: 500,
                    totalSize: formState.users.length, // replace later with size(users),
                    custom: true,
                  })}
                  keyField={'id'}
                  columns={contactListColumns}
                  data={formState.users}
                >
                  {({ paginationProps, paginationTableProps }) => {
                    return (
                      <ToolkitProvider
                        keyField={'id'}
                        data={formState.users}
                        columns={contactListColumns}
                        bootstrap4
                        search
                      >
                        {(toolkitProps) => (
                          <React.Fragment>
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
                          </React.Fragment>
                        )}
                      </ToolkitProvider>
                    )
                  }}
                </PaginationProvider>
              )}
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          {/* <div className="tab-pane fade"> */}

          <div className="account-setting deactivate-account">
            <h5 className="f-w-600 f-16">계정 수정</h5>
            <Row>
              <Col>
                <FormGroup>
                  <Label className="d-block mb-0">지점 이름</Label>
                  <Input
                    required=""
                    name="login[password]"
                    type="text"
                    className="form-control"
                    placeholder="지점 이름"
                    value={formState.companyname}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        companyname: e.target.value,
                      })
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="d-block mb-0">지점 주소</Label>
                  <Input
                    required=""
                    name="login[password]"
                    type="text"
                    className="form-control"
                    placeholder="지점 주소"
                    value={formState.companyaddr}
                    onChange={(e) => {
                      setFormState({
                        ...formState,
                        companyaddr: e.target.value,
                      })
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button
              type="button"
              color="primary"
              onClick={() => startmutaion()}
            >
              계정 수정
            </Button>
          </div>
          {/* </div> */}
        </TabPanel>
      </Tabs>
    </div>
  )
}

export default TabsetProfile
