<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" class="<?php echo $documentClass; ?>">
<head>
<?php Loader::packageElement('theme/head_tag', RedeauxPackage::PACKAGE_HANDLE); ?>
<?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body>


<?php Loader::packageElement('theme/nav', RedeauxPackage::PACKAGE_HANDLE); ?>
<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>