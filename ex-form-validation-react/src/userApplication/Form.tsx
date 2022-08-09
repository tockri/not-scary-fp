import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React from 'react'
import {
  initialFormData,
  FormData,
  FormDataSetter,
  setNameOnTyping,
  isSubmittable,
  setAddressOnFinish,
  setAddressOnTyping,
  setMailAddressOnFinish,
  setMailAddressOnTyping,
  setZipCodeOnFinish,
  setZipCodeOnTyping
} from './formData'

export const UserApplicationForm: React.FC<{initialFormData?:FormData}> = (props) => {
  const [formData, setFormData] = React.useState<FormData>(props.initialFormData || initialFormData)
  const listener = (setter: FormDataSetter) => (e: {
    target: { value: string }
  }) => {
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
                  onChange={listener(setNameOnTyping)}
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
                  onChange={listener(setMailAddressOnTyping)}
                  onBlur={listener(setMailAddressOnFinish)}
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
                  onChange={listener(setZipCodeOnTyping)}
                  onBlur={listener(setZipCodeOnFinish)}
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
                  onChange={listener(setAddressOnTyping)}
                  onBlur={listener(setAddressOnFinish)}
                  error={formData.address.hasError}
                  helperText={formData.address.errorMessage}
              />
            </Box>
            <Box>
              <Button
                  type="submit"
                  variant="contained"
                  disabled={!isSubmittable(formData)}
              >
                送信
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
  )
}
