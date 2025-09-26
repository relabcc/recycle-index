import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Badge,
} from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import Layout from '../../containers/Layout';
import GoogleOAuthWrapper from '../../components/GoogleOAuthWrapper';
import UploadSettings from '../../components/UploadSettings';

const AdminPage = ({ location }) => {
  const adminContent = <AdminPageContent location={location} />;
  
  return (
    <GoogleOAuthWrapper>
      {adminContent}
    </GoogleOAuthWrapper>
  );
};

const AdminPageContent = ({ location }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  // Authorized email addresses (in a real app, this would come from a config)
  const AUTHORIZED_EMAILS = [
    'admin@example.com',
    'manager@example.com',
    // Add more authorized emails here
  ];

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Get user info from Google
        const userResponse = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
              Accept: 'application/json'
            }
          }
        );
        
        const userInfo = await userResponse.json();
        setUser(userInfo);
        
        // Check if user is authorized
        const isAuthorized = AUTHORIZED_EMAILS.includes(userInfo.email);
        setAuthorized(isAuthorized);
        setLoading(false);
        
        if (isAuthorized) {
          // Store access token for API calls
          localStorage.setItem('google_access_token', response.access_token);
        }
      } catch (error) {
        console.error('Login failed:', error);
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setLoading(false);
    },
    scope: 'email profile https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file',
  });

  const logout = () => {
    setUser(null);
    setAuthorized(false);
    localStorage.removeItem('google_access_token');
  };

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('google_access_token');
    if (token) {
      // Verify token and get user info
      fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      })
      .then(response => response.json())
      .then(userInfo => {
        setUser(userInfo);
        const isAuthorized = AUTHORIZED_EMAILS.includes(userInfo.email);
        setAuthorized(isAuthorized);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('google_access_token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Layout path={location?.pathname || '/admin'}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>載入中...</Text>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout path={location?.pathname || '/admin'}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6}>
            <Heading>後台管理系統</Heading>
            <Text textAlign="center" color="gray.600">
              請使用 Google 帳號登入以存取後台管理功能
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={login}
            >
              使用 Google 登入
            </Button>
          </VStack>
        </Container>
      </Layout>
    );
  }

  if (!authorized) {
    return (
      <Layout path={location?.pathname || '/admin'}>
        <Container maxW="container.md" py={8}>
          <VStack spacing={6}>
            <Alert status="error">
              <AlertIcon />
              您的帳號 ({user.email}) 未被授權存取此管理系統。
            </Alert>
            <Button onClick={logout}>登出</Button>
          </VStack>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout path={location?.pathname || '/admin'}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading>後台管理系統</Heading>
              <Text color="gray.600">歡迎, {user.name}</Text>
            </VStack>
            <HStack>
              <Badge colorScheme="green">已授權</Badge>
              <Button size="sm" onClick={logout}>登出</Button>
            </HStack>
          </HStack>

          {/* Admin Sections */}
          <HStack spacing={6} align="stretch">
            {/* Popup Management */}
            <Card flex="1">
              <CardHeader>
                <Heading size="md">全站彈出視窗管理</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Text color="gray.600">
                    管理網站全域的彈出視窗，包括圖片、標題、內容和連結。
                  </Text>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={() => window.location.href = '/admin/popup'}
                  >
                    管理彈出視窗
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Countdown Management */}
            <Card flex="1">
              <CardHeader>
                <Heading size="md">全站倒數條管理</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Text color="gray.600">
                    管理頂部倒數計時條，設定活動時間、標題和行動按鈕。
                  </Text>
                  <Button
                    colorScheme="green"
                    width="full"
                    onClick={() => window.location.href = '/admin/countdown'}
                  >
                    管理倒數條
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </HStack>

          {/* Upload Settings */}
          <UploadSettings />

          {/* Google Sheets Info */}
          <Alert status="info">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Google Sheets 整合</Text>
              <Text fontSize="sm">
                設定資料會自動同步到 Google Sheets，您也可以直接在試算表中編輯內容。
                圖片可上傳到 Google Drive 並使用相同的 OAuth 權限管理。
              </Text>
            </Box>
          </Alert>
        </VStack>
      </Container>
    </Layout>
  );
};

export default AdminPage;