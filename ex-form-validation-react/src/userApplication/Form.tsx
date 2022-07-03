import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import {
  FormData,
  FormDataFunctions,
  FormDataSetter,
} from './formData'

const Funcs = FormDataFunctions

export const UserApplicationForm: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>(
    Funcs.initialize()
  )
  const makeListener =
    (setter: FormDataSetter) =>
      (e: { target: { value: string } }) => {
        setFormData((curr) => setter(curr, e.target.value))
      }

  return (
    <Box p={2}>
      <form
        method="post"
        action=""
        onSubmit={(e) => {
          e.preventDefault()
          alert(
            '以下の情報を送信しました（してません）。\n' +
            `名前: ${formData.name.value}\n` +
            `メールアドレス: ${formData.mailAddress.value}\n` +
            `郵便番号: ${formData.zipCode.value}\n` +
            `住所: ${formData.address.value}`
          )
        }}
      >
        <Stack direction="column" spacing={2}>
          <Box>
            <Typography>ユーザー情報を入力してください。</Typography>
          </Box>
          <Box>
            <TextField
              fullWidth
              label="名前"
              variant="outlined"
              size="small"
              value={formData.name.value}
              onChange={makeListener(Funcs.setNameOnTyping)}
              error={formData.name.hasError}
              helperText={formData.name.errorMessage}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="メールアドレス"
              variant="outlined"
              size="small"
              value={formData.mailAddress.value}
              onChange={makeListener(Funcs.setMailAddressOnTyping)}
              onBlur={makeListener(Funcs.setMailAddressOnFinish)}
              error={formData.mailAddress.hasError}
              helperText={formData.mailAddress.errorMessage}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="郵便番号"
              variant="outlined"
              size="small"
              value={formData.zipCode.value}
              onChange={makeListener(Funcs.setZipCodeOnTyping)}
              onBlur={makeListener(Funcs.setZipCodeOnFinish)}
              error={formData.zipCode.hasError}
              helperText={formData.zipCode.errorMessage}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="住所"
              variant="outlined"
              size="small"
              value={formData.address.value}
              onChange={makeListener(Funcs.setAddressOnTyping)}
              onBlur={makeListener(Funcs.setAddressOnFinish)}
              error={formData.address.hasError}
              helperText={formData.address.errorMessage}
            />
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={!Funcs.isSubmittable(formData)}
            >
              送信
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}
