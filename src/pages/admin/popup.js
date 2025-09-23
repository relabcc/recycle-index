import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Select,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Text,
  Image,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Layout from '../../containers/Layout';
import GoogleOAuthWrapper from '../../components/GoogleOAuthWrapper';

const PopupManagementPage = ({ location }) => {
  const content = <PopupManagementContent location={location} />;
  
  return (
    <GoogleOAuthWrapper>
      {content}
    </GoogleOAuthWrapper>
  );
};

const PopupManagementContent = ({ location }) => {
  const [config, setConfig] = useState({
    enabled: false,
    title: '',
    content: '',
    image: '',
    imageAlt: '',
    buttonText: '',
    buttonLink: '',
    buttonExternal: true,
    closeText: '關閉',
    size: 'md',
    delay: 3000,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/global-config');
      const data = await response.json();
      if (data.popup) {
        setConfig(prevConfig => ({ ...prevConfig, ...data.popup }));
      }
    } catch (error) {
      console.error('Error loading config:', error);
      toast({
        title: '載入失敗',
        description: '無法載入設定資料',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // In a real implementation, this would upload to Cloudflare R2, S3, or another service
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      if (data.url) {
        handleInputChange('image', data.url);
        toast({
          title: '上傳成功',
          description: '圖片已成功上傳',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: '上傳失敗',
        description: '圖片上傳失敗，請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/update-popup-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('google_access_token')}`,
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast({
          title: '儲存成功',
          description: '彈出視窗設定已更新',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('儲存失敗');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: '儲存失敗',
        description: '無法儲存設定，請稍後再試',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout path={location?.pathname || '/admin/popup'}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>載入設定中...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout path={location?.pathname || '/admin/popup'}>
      <Container maxW="container.md" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => window.location.href = '/admin'}
            >
              回到管理首頁
            </Button>
          </HStack>

          <Heading>彈出視窗管理</Heading>

          <Alert status="info">
            <AlertIcon />
            設定會即時套用到網站上，並同步到 Google Sheets。
          </Alert>

          <Card>
            <CardHeader>
              <Heading size="md">基本設定</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>啟用彈出視窗</FormLabel>
                  <Switch
                    isChecked={config.enabled}
                    onChange={(e) => handleInputChange('enabled', e.target.checked)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>標題</FormLabel>
                  <Input
                    value={config.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="輸入彈出視窗標題"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>內容</FormLabel>
                  <Textarea
                    value={config.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="輸入彈出視窗內容（支援 HTML）"
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>圖片</FormLabel>
                  <VStack align="stretch">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    {uploading && <Text color="blue.500">上傳中...</Text>}
                    {config.image && (
                      <Box>
                        <Text fontSize="sm" mb={2}>目前圖片：</Text>
                        <Image 
                          src={config.image} 
                          alt="preview" 
                          maxH="200px"
                          objectFit="contain"
                        />
                      </Box>
                    )}
                    <Input
                      value={config.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="或直接輸入圖片網址"
                      size="sm"
                    />
                  </VStack>
                </FormControl>

                <FormControl>
                  <FormLabel>圖片替代文字</FormLabel>
                  <Input
                    value={config.imageAlt}
                    onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                    placeholder="圖片的替代文字"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">按鈕設定</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>按鈕文字</FormLabel>
                  <Input
                    value={config.buttonText}
                    onChange={(e) => handleInputChange('buttonText', e.target.value)}
                    placeholder="按鈕顯示文字"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>按鈕連結</FormLabel>
                  <Input
                    value={config.buttonLink}
                    onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                    placeholder="按鈕點擊後的連結"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>外部連結</FormLabel>
                  <Switch
                    isChecked={config.buttonExternal}
                    onChange={(e) => handleInputChange('buttonExternal', e.target.checked)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>關閉按鈕文字</FormLabel>
                  <Input
                    value={config.closeText}
                    onChange={(e) => handleInputChange('closeText', e.target.value)}
                    placeholder="關閉按鈕的文字"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">顯示設定</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>視窗大小</FormLabel>
                  <Select
                    value={config.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                  >
                    <option value="sm">小</option>
                    <option value="md">中</option>
                    <option value="lg">大</option>
                    <option value="xl">特大</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>延遲時間（毫秒）</FormLabel>
                  <Input
                    type="number"
                    value={config.delay}
                    onChange={(e) => handleInputChange('delay', parseInt(e.target.value))}
                    placeholder="彈出視窗出現的延遲時間"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Button
            colorScheme="blue"
            size="lg"
            onClick={saveConfig}
            isLoading={saving}
            loadingText="儲存中..."
          >
            儲存設定
          </Button>
        </VStack>
      </Container>
    </Layout>
  );
};

export default PopupManagementPage;