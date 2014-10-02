<?php defined('C5_EXECUTE') or die("Access Denied.");

    $itemsPerPage = (int) isset($_REQUEST['count']) ? $_REQUEST['count'] : 9;

    new InstagramAPI(function( InstagramAPI $instance ) use ($itemsPerPage){
        $response = $instance->getRecentByUser($instance::USER_ID, $itemsPerPage);
        //$response = $instance->getRecentByTag('focus43', $itemsPerPage);

        foreach($response->data AS $mediaObj){ ?>
            <div class="gram" style="background-image:url('<?php echo $mediaObj->images->standard_resolution->url; ?>');">
                <div class="tabular">
                    <div class="cellular">
                        <span class="caption"><?php echo !empty($mediaObj->caption->text) ? $mediaObj->caption->text : '"I am empty" - caption'; ?></span>
                    </div>
                </div>
                <a class="on-insta" href="<?php echo $mediaObj->link; ?>" target="_blank"><i class="fa fa-instagram"></i></a>
                <span class="username">by <em><?php echo $mediaObj->user->username; ?></em></span>
            </div>
        <?php }
    });