<?php
    if( !($this->controller instanceof RedeauxPageController) ){
        $pageController = new RedeauxPageController;
        $pageController->attachThemeAssets( $this->controller );
    }
?>
<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" class="<?php echo $cmsClasses; ?>">
<head>
    <?php Loader::packageElement('theme/head_tag', RedeauxPackage::PACKAGE_HANDLE); ?>
    <?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body ng-controller="CtrlRoot">

<div id="level-1">
    <?php Loader::packageElement('theme/nav', RedeauxPackage::PACKAGE_HANDLE); ?>
    <div id="level-2">
        <img class="logo" src="<?php echo REDEAUX_IMAGE_PATH; ?>logo.png" />

        <div id="parallax" parallaxer>
            <div class="layer sky"></div>
            <div class="layer mtn"></div>
        </div>

        <div id="level-3">
            <section class="page-body" ng-view ng-animate-children>
                <?php echo $innerContent; ?>
            </section>
        </div>

    </div>
</div>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>