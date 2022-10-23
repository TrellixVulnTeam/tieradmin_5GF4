import React from 'react'
import { Home } from 'react-feather'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { useQuery, gql } from '@apollo/client'

const ME_QUERY = gql`
  query product {
    product(id: 1) {
      id
      title
      description
    }
  }
`

const Breadcrumb = ({ title, parent }) => {
  const { loading, error, data } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      console.log('data!3', data)
    },
    onError: (error) => {
      console.log('error!3', error)
    },
  })
  return (
    <Container fluid={true}>
      <div className="page-header">
        <Row>
          <Col lg="6">
            <div className="page-header-left">
              <h3>
                {title}
                <small>(알림)엑셀을 업로드 할 경우, 기존의 데이터는 자동 삭제됩니다.</small>
              </h3>
            </div>
          </Col>
          <Col lg="6">
            <ol className="breadcrumb pull-right">
              <li className="breadcrumb-item">
                <Link to="mutikart-admin/dashboard">
                  <Home />
                </Link>
              </li>
              <li className="breadcrumb-item">{parent}</li>
              <li className="breadcrumb-item active">{title}</li>
            </ol>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Breadcrumb
