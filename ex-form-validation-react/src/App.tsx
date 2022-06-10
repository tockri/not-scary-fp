import { Container } from '@mui/material'
import React from 'react'
import { UserApplicationForm } from './userApplication/Form'

export const App: React.FC = () => {
  return (
    <Container>
      <UserApplicationForm />
    </Container>
  )
}
