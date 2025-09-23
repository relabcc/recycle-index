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
  Switch,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import Layout from '../../containers/Layout';
import GoogleOAuthWrapper from '../../components/GoogleOAuthWrapper';

const CountdownManagementPage = ({ location }) => {
  const content = <CountdownManagementContent location={location} />;
  
  return (
    <GoogleOAuthWrapper>
      {content}
    </GoogleOAuthWrapper>
  );
};

const CountdownManagementContent = ({ location }) => {
  const [config, setConfig] = useState({
    enabled: false,
    title: '限時倒數',
    endDate: '',
    backgroundColor: '#e53e3e',
    textColor: '#ffffff',
    buttonText: '',
    buttonLink: '',
    buttonExternal: true,
    buttonBg: '#ffffff',
    buttonColor: '#e53e3e',
    buttonHoverBg: '#f7fafc',
    closeable: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/global-config');
      const data = await response.json();
      if (data.countdown) {
        setConfig(prevConfig => ({ ...prevConfig, ...data.countdown }));
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

  const saveConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/update-countdown-config', {
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
          description: '倒數條設定已更新',
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

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  if (loading) {
    return (
      <Layout path={location?.pathname || '/admin/countdown'}>
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
    <Layout path={location?.pathname || '/admin/countdown'}>
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

          <Heading>倒數條管理</Heading>

          <Alert status="info">
            <AlertIcon />
            倒數條會顯示在網站頂部，設定會即時套用並同步到 Google Sheets。
          </Alert>

          <Card>
            <CardHeader>
              <Heading size="md">基本設定</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>啟用倒數條</FormLabel>
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
                    placeholder="倒數條標題"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>結束時間</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formatDateTimeLocal(config.endDate)}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    設定倒數計時的結束時間
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>允許關閉</FormLabel>
                  <Switch
                    isChecked={config.closeable}
                    onChange={(e) => handleInputChange('closeable', e.target.checked)}
                  />
                  <Text fontSize="sm" color="gray.500">
                    是否顯示關閉按鈕讓使用者隱藏倒數條
                  </Text>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">樣式設定</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>背景顏色</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      w="60px"
                    />
                    <Input
                      value={config.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                      placeholder="#e53e3e"
                    />
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>文字顏色</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      w="60px"
                    />
                    <Input
                      value={config.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </HStack>
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
                    placeholder="按鈕顯示文字（留空則不顯示按鈕）"
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
                  <FormLabel>按鈕背景顏色</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={config.buttonBg}
                      onChange={(e) => handleInputChange('buttonBg', e.target.value)}
                      w="60px"
                    />
                    <Input
                      value={config.buttonBg}
                      onChange={(e) => handleInputChange('buttonBg', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>按鈕文字顏色</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={config.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      w="60px"
                    />
                    <Input
                      value={config.buttonColor}
                      onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                      placeholder="#e53e3e"
                    />
                  </HStack>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          {/* Preview */}
          {config.enabled && (
            <Card>
              <CardHeader>
                <Heading size="md">預覽</Heading>
              </CardHeader>
              <CardBody>
                <Box
                  bg={config.backgroundColor}
                  color={config.textColor}
                  p={4}
                  borderRadius="md"
                  textAlign="center"
                >
                  <Text fontWeight="bold">{config.title} 00:00:00</Text>
                  {config.buttonText && (
                    <Button
                      size="sm"
                      mt={2}
                      bg={config.buttonBg}
                      color={config.buttonColor}
                    >
                      {config.buttonText}
                    </Button>
                  )}
                </Box>
              </CardBody>
            </Card>
          )}

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

export default CountdownManagementPage;