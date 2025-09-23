import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  Input,
  Text,
  Alert,
  AlertIcon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { createUploadService } from '../../services/uploadService';

const UploadSettings = () => {
  const [provider, setProvider] = useState('googledrive');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState('');
  const [testUploading, setTestUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Load saved settings from localStorage
    const savedProvider = localStorage.getItem('upload_provider');
    const savedFolderId = localStorage.getItem('google_drive_folder_id');
    
    if (savedProvider) setProvider(savedProvider);
    if (savedFolderId) setGoogleDriveFolderId(savedFolderId);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('upload_provider', provider);
    localStorage.setItem('google_drive_folder_id', googleDriveFolderId);
    
    toast({
      title: '設定已儲存',
      description: '上傳服務設定已更新',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const testUpload = async () => {
    setTestUploading(true);
    try {
      const accessToken = localStorage.getItem('google_access_token');
      if (!accessToken) {
        throw new Error('請先登入 Google 帳號');
      }

      const uploadService = createUploadService(provider, {
        googleDriveFolderId: googleDriveFolderId || undefined,
      });

      toast({
        title: '測試完成',
        description: `${uploadService.getProviderName()} 連線正常`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '測試失敗',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setTestUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">上傳服務設定</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="stretch">
          <Alert status="info">
            <AlertIcon />
            配置圖片上傳的儲存服務。Google Drive 會使用相同的 OAuth 權限。
          </Alert>

          <FormControl>
            <FormLabel>儲存服務</FormLabel>
            <RadioGroup value={provider} onChange={setProvider}>
              <Stack spacing={3}>
                <Radio value="googledrive">
                  <Box>
                    <Text fontWeight="bold">Google Drive</Text>
                    <Text fontSize="sm" color="gray.600">
                      使用 Google OAuth 權限，檔案儲存在 Google Drive
                    </Text>
                  </Box>
                </Radio>
                <Radio value="cloudflare">
                  <Box>
                    <Text fontWeight="bold">Cloudflare R2</Text>
                    <Text fontSize="sm" color="gray.600">
                      高效能雲端儲存，需要 R2 bucket 設定
                    </Text>
                  </Box>
                </Radio>
                <Radio value="local">
                  <Box>
                    <Text fontWeight="bold">本地伺服器</Text>
                    <Text fontSize="sm" color="gray.600">
                      儲存在網站伺服器，需要檔案寫入權限
                    </Text>
                  </Box>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          {provider === 'googledrive' && (
            <FormControl>
              <FormLabel>Google Drive 資料夾 ID（選填）</FormLabel>
              <Input
                value={googleDriveFolderId}
                onChange={(e) => setGoogleDriveFolderId(e.target.value)}
                placeholder="留空則儲存到根目錄"
              />
              <Text fontSize="sm" color="gray.600" mt={1}>
                在 Google Drive 中建立資料夾，從網址中複製資料夾 ID
              </Text>
            </FormControl>
          )}

          <Stack direction="row" spacing={3}>
            <Button onClick={saveSettings} colorScheme="blue">
              儲存設定
            </Button>
            <Button 
              onClick={testUpload} 
              variant="outline" 
              isLoading={testUploading}
              loadingText="測試中..."
            >
              測試連線
            </Button>
          </Stack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default UploadSettings;