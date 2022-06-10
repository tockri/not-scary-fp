import React from 'react'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { ApplicationFormData } from './applicationForm'

export const UserApplicationForm: React.FC = () => {
  const [formData, setFormData] = React.useState<ApplicationFormData>(
    ApplicationFormData.initialize()
  )

  return (
    <Box p={2}>
      <form
        method="post"
        action="javascript:void(0)"
        onSubmit={() => {
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
              onChange={(e) => {
                setFormData((curr) =>
                  ApplicationFormData.setName(curr, e.target.value)
                )
              }}
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
              onChange={(e) =>
                setFormData((curr) =>
                  ApplicationFormData.setMailAddress(curr, e.target.value)
                )
              }
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
              onChange={(e) =>
                setFormData((curr) =>
                  ApplicationFormData.setZipCode(curr, e.target.value)
                )
              }
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
              onChange={(e) =>
                setFormData((curr) =>
                  ApplicationFormData.setAddress(curr, e.target.value)
                )
              }
              error={formData.address.hasError}
              helperText={formData.address.errorMessage}
            />
          </Box>
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={!ApplicationFormData.isSubmittable(formData)}
            >
              送信
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  )
}
