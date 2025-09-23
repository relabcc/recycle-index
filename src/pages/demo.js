import React, { useState } from 'react';
import {
  Container,
  Heading,
  VStack,
  Button,
  Text,
  Box,
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import Layout from '../containers/Layout';
import GlobalPopup from '../components/GlobalPopup';
import CountdownBanner from '../components/CountdownBanner';
import { mockPopupConfig, mockCountdownConfig } from '../utils/mockConfig';

const DemoPage = ({ location }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  const popupConfig = showPopup ? mockPopupConfig : { enabled: false };
  const countdownConfig = showCountdown ? mockCountdownConfig : { enabled: false };

  return (
    <Layout path={location?.pathname || '/demo'}>
      {/* Mock countdown banner for demo */}
      <CountdownBanner config={countdownConfig} />
      
      <Container maxW="container.md" py={8} mt={showCountdown ? '4em' : '0'}>
        <VStack spacing={6} align="stretch">
          <Heading textAlign="center">管理系統組件展示</Heading>
          
          <Alert status="info">
            <AlertIcon />
            這是展示頁面，用於測試彈出視窗和倒數條組件的功能。
          </Alert>

          <Box p={6} borderWidth={1} borderRadius="lg">
            <VStack spacing={4} align="stretch">
              <Heading size="md">彈出視窗控制</Heading>
              <FormControl>
                <FormLabel>啟用彈出視窗</FormLabel>
                <Switch
                  isChecked={showPopup}
                  onChange={(e) => setShowPopup(e.target.checked)}
                />
              </FormControl>
              <Text fontSize="sm" color="gray.600">
                開啟後將在 3 秒後顯示彈出視窗（每次頁面載入只會顯示一次）
              </Text>
            </VStack>
          </Box>

          <Box p={6} borderWidth={1} borderRadius="lg">
            <VStack spacing={4} align="stretch">
              <Heading size="md">倒數條控制</Heading>
              <FormControl>
                <FormLabel>啟用倒數條</FormLabel>
                <Switch
                  isChecked={showCountdown}
                  onChange={(e) => setShowCountdown(e.target.checked)}
                />
              </FormControl>
              <Text fontSize="sm" color="gray.600">
                開啟後將在頁面頂部顯示倒數計時條
              </Text>
            </VStack>
          </Box>

          <Box p={6} borderWidth={1} borderRadius="lg">
            <VStack spacing={4} align="stretch">
              <Heading size="md">後台管理</Heading>
              <Text>
                實際的後台管理功能可以通過以下連結存取：
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => window.location.href = '/admin'}
              >
                前往後台管理
              </Button>
              <Text fontSize="sm" color="gray.600">
                注意：後台管理需要 Google OAuth 認證和相應的 API 設定
              </Text>
            </VStack>
          </Box>

          <Box p={6} borderWidth={1} borderRadius="lg" bg="gray.50">
            <VStack spacing={4} align="stretch">
              <Heading size="md">設定說明</Heading>
              <Text fontSize="sm">
                <strong>開發環境設定：</strong>
              </Text>
              <Text fontSize="sm">
                1. 複製 .env.example 為 .env.development<br/>
                2. 設定 Google Sheets API 金鑰和試算表 ID<br/>
                3. 設定 Google OAuth Client ID<br/>
                4. 配置授權的電子郵件清單
              </Text>
              <Text fontSize="sm">
                <strong>生產環境部署：</strong>
              </Text>
              <Text fontSize="sm">
                1. 將 functions/ 目錄部署到 Cloudflare Pages<br/>
                2. 或將 api/ 目錄部署到 PHP 伺服器<br/>
                3. 設定相應的環境變數<br/>
                4. 綁定 Cloudflare R2 bucket（圖片上傳）
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Mock popup for demo */}
      <GlobalPopup config={popupConfig} />
    </Layout>
  );
};

export default DemoPage;