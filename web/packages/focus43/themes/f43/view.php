<?php
    if( !($this->controller instanceof Focus43PageController) ){
        $pageController = new Focus43PageController;
        $pageController->attachThemeAssets( $this->controller );
    }
?>
<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>" class="<?php echo $documentClass; ?>">
<head>
    <?php Loader::packageElement('theme/head_tag', 'focus43'); ?>
    <?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
</head>

<body class="pt-<?php echo $sectionElement; ?>" ng-class="{'sidebar-open':sidebar,'working':working}" animator preloader>

    <div id="parallax">
        <div class="inner">
            <div id="layer-butte" class="layer"></div>
            <div id="layer-clouds" class="layer"></div>
            <div id="layer-moon" class="layer"></div>
        </div>
    </div>

    <div id="content">
        <div id="content-l2">
            <div ng-animate-children class="page"<?php if( !$cmsToolbar ){echo ' ng-view';} ?>>
                <?php echo $innerContent; ?>
            </div>
        </div>

        <!-- nav (sidebar) -->
        <?php Loader::packageElement('theme/nav', 'focus43'); ?>
    </div>

<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>