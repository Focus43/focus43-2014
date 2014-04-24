<?php
    if( !($this->controller instanceof TojPageController) ){
        $tojController = new TojPageController;
        $tojController->attachThemeAssets( $this->controller );
    }
?>
<!DOCTYPE HTML>
<html lang="<?php echo LANGUAGE; ?>">
<head>
    <?php Loader::element('header_required'); // REQUIRED BY C5 // ?>
    <?php Loader::packageElement('theme/head_tag_inner', 'toj'); ?>
</head>

<body class="<?php echo $bodyClass; ?>">

    <div id="sidebarLeft" class="sidebars" data-load="<?php echo TOJ_TOOLS_URL; ?>sidebar_left">
        <?php if( Page::getCurrentPage()->isEditMode() ){
            Loader::packageElement('partials/sidebar_left', 'toj', array('c' => $c));
        }else{ ?>
            <div class="working"><i class="fa fa-refresh fa-spin"></i></div>
        <?php } ?>
    </div>

    <div id="sidebarRight" class="sidebars" data-load="<?php echo TOJ_TOOLS_URL; ?>sidebar_right">
        <?php if( Page::getCurrentPage()->isEditMode() ){
            Loader::packageElement('partials/sidebar_right', 'toj', array('c' => $c));
        }else{ ?>
            <div class="working"><i class="fa fa-refresh fa-spin"></i></div>
        <?php } ?>
    </div>

    <div id="cL1">
        <span id="pageBackgroundImage">
            <span class="backStretch" data-background="<?php echo $backgroundImage; ?>"></span>
        </span>

        <div id="cL2">
            <?php Loader::packageElement('theme/primary_navigation', 'toj', array('c' => $c)); ?>

            <div id="cL3">
                <div class="row">
                    <div class="col-sm-12">
                        <div id="cL4">

                            <!-- actual page content -->
                            <div id="cPageContent">
                                <?php Loader::packageElement('theme/landing_page_header', 'toj'); ?>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <?php print $innerContent; ?>
                                    </div>
                                </div>
                            </div>
                            <!-- end page content -->

                        </div>
                    </div>
                </div>
            </div>

            <?php Loader::packageElement('theme/footer', 'toj', array('c' => $c)); ?>
        </div>
    </div>

<?php Loader::packageElement('theme/site_settings', 'toj'); ?>
<?php Loader::element('footer_required'); // REQUIRED BY C5 // ?>
</body>
</html>