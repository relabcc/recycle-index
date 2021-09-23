<?php
$zip = new ZipArchive;
$res = $zip->open('public.zip');
if ($res === TRUE) {
  $zip->extractTo('.');
  $zip->close();
  echo 'extracted.';
} else {
  echo 'Error';
}
