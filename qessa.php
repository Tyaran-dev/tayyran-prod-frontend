<?php
// Exit if accessed directly
if ( !defined( 'ABSPATH' ) ) exit;

// BEGIN ENQUEUE PARENT ACTION
// AUTO GENERATED - Do not modify or remove comment markers above or below:

// send page url in the requst data
// Add this to your theme's functions.php
function add_page_tracking_script() {
    ?>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Set page source as page title + slug
        var pageSourceField = document.getElementById('page_source');
        if (pageSourceField) {
            // Get clean page title - remove site name more aggressively
            var pageTitle = document.title;
            
            // Remove common site name patterns
            pageTitle = pageTitle
                .replace(/\s*[-|]\s*قصة للسفر والسياحة\s*$/, '')
                .replace(/\s*[-|]\s*شركة سياحة الرياض\s*$/, '')
                .replace(/\s*[-|]\s*أفضل مكتب سياحي الرياض\s*$/, '')
                .replace(/\s*[-|]\s*أفضل عروض السفر\s*$/, '')
                .replace(/\s*[-|]\s*بكجات سياحية\s*$/, '')
                .trim();
            
            // If title is still too long, use the first part
            if (pageTitle.length > 50) {
                pageTitle = pageTitle.split('|')[0].split('-')[0].trim();
            }
            
            // Get the slug from URL (last part of path)
            var path = window.location.pathname;
            var pathParts = path.split('/').filter(Boolean);
            var slug = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'home';
            
            // Decode URL-encoded slug for Arabic text
            try {
                slug = decodeURIComponent(slug);
            } catch (e) {
                // If decoding fails, keep original slug
            }
            
            // Combine title and slug
            pageSourceField.value = pageTitle + ' - ' + slug;
        }
        
        // Set current date and time
        var now = new Date();
        var dateField = document.getElementById('submission_date');
        var timeField = document.getElementById('submission_time');
        
        if (dateField) {
            dateField.value = now.toLocaleDateString('ar-SA');
        }
        if (timeField) {
            timeField.value = now.toLocaleTimeString('ar-SA');
        }
    });
    </script>
    <?php
}
add_action('wp_footer', 'add_page_tracking_script');




if ( !function_exists( 'chld_thm_cfg_locale_css' ) ):
    function chld_thm_cfg_locale_css( $uri ){
        if ( empty( $uri ) && is_rtl() && file_exists( get_template_directory() . '/rtl.css' ) )
            $uri = get_template_directory_uri() . '/rtl.css';
        return $uri;
    }
endif;
add_filter( 'locale_stylesheet_uri', 'chld_thm_cfg_locale_css' );
         
if ( !function_exists( 'child_theme_configurator_css' ) ):
    function child_theme_configurator_css() {
        wp_enqueue_style( 'chld_thm_cfg_child', trailingslashit( get_stylesheet_directory_uri() ) . 'style.css', array( 'swiper-css','select2-css','custom-style' ) );
    }
endif;
add_action( 'wp_enqueue_scripts', 'child_theme_configurator_css', 10 );

// END ENQUEUE PARENT ACTION


// hero section
function custom_php_shortcode() {
    ob_start();
    ?>
    <?php
    // get all destination terms and put them in array
    $destinations = get_terms( array(
      'taxonomy' => 'destination',
      'hide_empty' => true,
    ) );

    // get trip archive page link
    $trip_archive_url = get_post_type_archive_link('trip');
    ?>
    
    <main class="q--main">
        <?php 
          $hero_section = get_field('hero-section', 'option');
          $img_id = 1510;
          $img_url = wp_get_attachment_url($img_id);
        ?>

        <!-- hero section -->
        <section class="q--section hero--section">
            <div class="contain">
                <div class="hero--section__content">
                    <div class="hero--details">
                        <h2 class="hero--subtitle">
                            <?php echo $hero_section['subtitle']; ?>
                        </h2>
                        <h1 class="hero--title">
                            <?php echo $hero_section['title']; ?>
                        </h1>
                        <p class="hero--desc">
                            <?php echo $hero_section['desc']; ?>
                        </p>
                    </div>
                </div>
            </div>

            <?php if($hero_section['show-search-form']) : ?>
            <div class="hero--search__form">
                <form action="<?php echo home_url('/'); ?>" method="get">
                    <div class="inputs--wrapper">
                        <div class="input--group">
                            <label for="s">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Your SVG code -->
                                </svg>
                                <div class="label--and--input">
                                    <p>وين حابب تسافر؟</p>
                                    <input type="text" placeholder="اسم الرحلة او المكان" name="s" id="search" value="<?php echo isset($_GET['s']) ? $_GET['s'] : ''; ?>">
                                </div>
                            </label>
                        </div>

                        <div class="q--line__v"></div>

                        <div class="input--group">
                            <label for="destination">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Your SVG code -->
                                </svg>
                                <div class="label--and--input">
                                    <p>الوجهة أو البلد</p>
                                    <select id="destination" name="destination" class="q--select" data-placeholder="كل الوجهات">
                                        <option value="-1" disabled hidden>اختر وجهة</option>
                                        <option value="">كل الوجهات</option>
                                        <?php foreach ($destinations as $destination) : ?>
                                            <option value="<?php echo $destination->name; ?>" <?php echo isset($_GET['destination']) && $_GET['destination'] == $destination->name ? 'selected' : ''; ?>>
                                                <?php echo $destination->name; ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                            </label>
                        </div>

                        <div class="q--line__v"></div>

                        <div class="input--group">
                            <label for="duration">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <!-- Your SVG code -->
                                </svg>
                                <div class="label--and--input">
                                    <p>مدة الرحلة</p>
                                    <select id="duration" name="duration" class="q--select" data-placeholder="كل الفترات">
                                        <option value="-1" disabled hidden>اختر فترة</option>
                                        <option value="">كل الفترات</option>
                                        <option value="11">من 1 إلى 5</option>
                                        <option value="22">من 5 إلى 10</option>
                                        <option value="33">أكثر من 10</option>
                                    </select>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button class="q--btn hero--search__btn">
                        <span>ابحث الآن</span>
                    </button>
                </form>
            </div>
            <?php endif; ?>
        </section>
        <!-- end hero section -->
    </main>
    <?php
    return ob_get_clean();
}
add_shortcode('hero-section', 'custom_php_shortcode');

// destnitions section 
function destinations_section_shortcode() {
    ob_start();
    ?>
   <main class="q--main">

    <!-- destinations section -->
    <section class="q--section dest--section">
      <?php 
        $destinations_section = get_field('destinations-section', 'option');
      ?>
      <div class="contain">
        <div class="section--title">
          <div class="q--heading__box">
            <div class="heading--box__text">
              <p class="heading--box__subtitle">
                <?php 
                  echo $destinations_section['subtitle'];
                ?>
              </p>
              <h2 class="heading--box__title">
                <?php 
                  echo $destinations_section['title'];
                ?>
              </h2>
            </div>
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Your SVG code here -->
            </svg>
          </div>
        </div>

        <?php 
          // destination taxonomy query
          $destinations = get_terms(array(
            'taxonomy' => 'destination',
            'hide_empty' => false,
            'parent' => 0
          ));

          // Filter out destinations where hidden-destnation is true
          $destinations = array_filter($destinations, function($destination) {
            $is_hidden = get_field('hidden-destnation', $destination);
            return !$is_hidden;
          });

          // Sort by destination-order ACF field
          usort($destinations, function($a, $b) {
            $order_a = get_field('destination-order', $a);
            $order_b = get_field('destination-order', $b);

            $order_a = is_numeric($order_a) ? (int)$order_a : 0;
            $order_b = is_numeric($order_b) ? (int)$order_b : 0;

            return $order_b - $order_a;
          });

          // Limit to desired number after sorting
          $destinations = array_slice($destinations, 0, $destinations_section['destinations-number']);
        ?>

        <div class="dest--section__content">
          <ul class="dest--list dest--list--airplane">
            <?php 
              // loop over destinations array
              foreach($destinations as $destination):
                $destination_url = get_term_link($destination);
            ?>
            <li class="dest--item dest--item--airplane">
              <a href="<?php echo $destination_url; ?>">
                <div class="airplane-window">
                  <div class="airplane-window__frame">
                    <img loading="lazy" src="<?php echo get_field('destination-img', $destination); ?>"
                    alt="<?php echo $destination->name; ?>" class="dest--item__img" width="227" height="196">
                    <div class="window-highlight"></div>
                  </div>
                  <div class="dest--item__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="18" fill="white" fill-opacity="0.9"/>
                      <path d="M20 10L25 18H22V30H18V18H15L20 10Z" fill="#24b26f"/>
                    </svg>
                  </div>
                </div>
                <div class="dest--item__info">
                  <h3 class="dest--item__title">
                    <?php echo $destination->name; ?>
                  </h3>
                  <span class="dest--item__trips-number">
                    <?php 
                      // get number of trips for each destination
                      $trips = get_posts(array(
                        'post_type' => 'trip',
                        'posts_per_page' => -1,
                        'tax_query' => array(
                          array(
                            'taxonomy' => 'destination',
                            'field' => 'term_id',
                            'terms' => $destination->term_id
                          )
                        )
                      ));
                      if(count($trips) == 1) {
                        echo 'رحلة واحدة';
                      }
                      elseif(count($trips) == 2) {
                        echo 'رحلتان';
                      }
                      elseif(count($trips) > 10) {
                        echo count($trips) . ' رحلة';
                      }
                      else {
                        echo count($trips) . ' رحلات';
                      }
                    ?>
                  </span>
                </div>
              </a>
            </li>
            <?php 
              endforeach;
            ?>
          </ul>

          <?php 
            if($destinations_section['btn']['show-btn']) :
          ?>

          <div class="q--btn__group">
            <a class="q--btn" href="<?php echo $destinations_section['btn']['text-and-url']['url']; ?>" target="<?php echo $destinations_section['btn']['text-and-url']['target']; ?>">
              <span>
                <?php 
                  echo $destinations_section['btn']['text-and-url']['title'];
                ?>
              </span>
            </a>
          </div>
          <?php endif; ?>
        </div>

      </div>
    </section>
    <!-- end destinations section -->
	   
    <?php
    return ob_get_clean();
}
add_shortcode('destinations-section', 'destinations_section_shortcode');




function trips_section_shortcode() {
    ob_start();
    
    $trips_section = get_field('trips-section', 'option');
?>
<!-- trips section -->
<section class="q--section trips--section">
    <div class="contain">
        <div class="q--heading__box">
            <div class="heading--box__text">
                <p class="heading--box__subtitle">
                    <?php 
                        echo $trips_section['subtitle'];
                    ?>
                </p>
                <h2 class="heading--box__title">
                    <?php 
                        echo $trips_section['title'];
                    ?>
                </h2>
            </div>
        </div>
    </div>

    <?php 
        // Query trips where the ACF checkbox field 'featured' contains the value 'featured'
        $trips = new WP_Query(array(
            'post_type' => 'trip',
            'meta_query' => array(
                array(
                    'key' => 'featured', // The ACF field key
                    'value' => 'featured', // Note the quotes to match the serialized format
                    'compare' => 'LIKE' // Needed to search within serialized arrays
                )
            )
        ));

        if($trips->have_posts()) :
    ?>
    <div class="trips--list">
        <div class="swiper trips--slider">
            <div class="swiper-wrapper">
                <?php 
                    while($trips->have_posts()) :
                        $trips->the_post();
                ?>
                <div class="swiper-slide">
                    <a class="trip--item" href="<?php the_permalink(); ?>">
                        <img class="trip--img" src="<?php echo get_the_post_thumbnail_url(); ?>" alt="trip image"> 
                        <div class="trip--data">
                            <div class="trip--dest">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M43.5,25c0,-8.6 -6.9,-15.5 -15.5,-15.5c-8.6,0 -15.5,6.9 -15.5,15.5c0,3.8 1.4,7.3 3.7,10.1c0,0 7.4,8.4 9.7,10.6c1.2,1.1 3,1.1 4.1,0c2.7,-2.6 9.7,-10.6 9.7,-10.6c2.4,-2.8 3.8,-6.3 3.8,-10.1z" fill-opacity="0.67059" fill="#24b26f" stroke="none" stroke-width="1" stroke-linecap="butt"></path><circle cx="24" cy="21" r="4.5" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="butt"></circle><path d="M35.8,31.1c2.3,-2.7 3.7,-6.2 3.7,-10.1c0,-8.6 -6.9,-15.5 -15.5,-15.5c-3,0 -5.8,0.9 -8.2,2.3" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round"></path><path d="M10.4,13.6c-1.2,2.2 -1.9,4.7 -1.9,7.4c0,3.8 1.4,7.3 3.7,10.1c0,0 7.4,8.4 9.7,10.6c1.2,1.1 3,1.1 4.1,0c1.5,-1.4 3.2,-3.3 5.4,-5.8" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round"></path></g></g></svg>
                                <span>
                                    <?php
                                        $terms = get_the_terms(get_the_ID(), 'destination');
                                        if ($terms && !is_wp_error($terms)) {
                                            echo $terms[0]->name;
                                        }
                                    ?>
                                </span>
                            </div>

                            <div class="trip--duration">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M39.8,45h-23.6c-2.9,0 -5.2,-2.3 -5.2,-5.2v-23.6c0,-2.9 2.3,-5.2 5.2,-5.2h23.6c2.9,0 5.2,2.3 5.2,5.2v23.6c0,2.9 -2.3,5.2 -5.2,5.2z" fill-opacity="0.67059" fill="#24b26f" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M26.4,7.5h9.1c2.8,0 5,2.2 5,5v23c0,2.8 -2.2,5 -5,5h-23c-2.8,0 -5,-2.2 -5,-5v-9" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20.7,15.5h19.8" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M33.5,5v4.5" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.4,2c1,-0.3 2,-0.5 3.1,-0.5c5.5,0 10,4.5 10,10c0,5.5 -4.5,10 -10,10c-5.5,0 -10,-4.5 -10,-10c0,-0.9 0.1,-1.7 0.3,-2.6" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.5,6.5v5l2,2" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></g></g></svg>

                                <span>
                                    <?php
                                        $duration = get_field('duration');
                                        if($duration == 1) {
                                            echo 'يوم واحد';
                                        }
                                        elseif($duration == 2) {
                                            echo 'يومين';
                                        }
                                        elseif($duration > 10) {
                                            echo $duration . ' يوم';
                                        }
                                        else {
                                            echo $duration . ' أيام';
                                        }
                                    ?>
                                </span>
                            </div>
                        </div>

                        <?php 
                            if(get_field('rate')):
                        ?>

                        <div class="trip--rate">
                            <?php 
                                $rate = get_field('rate');
                                for($i = 0; $i < $rate; $i++) :
                            ?>
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M27,41.7l-7.3,3.8c-2.3,1.2 -5.1,-0.7 -4.7,-3.3l1.3,-8.4c0.1,-0.7 -0.1,-1.4 -0.6,-1.8l-5.6,-5.6c-1.9,-1.9 -0.8,-5.1 1.8,-5.5l8.3,-1.3c0.7,-0.1 1.3,-0.5 1.6,-1.2l3.3,-6.5c1.2,-2.4 4.6,-2.4 5.8,0l3.3,6.5c0.3,0.6 0.9,1.1 1.6,1.2l8.3,1.3c2.6,0.4 3.6,3.6 1.8,5.5l-5.7,5.6c-0.5,0.5 -0.7,1.2 -0.6,1.8l1.3,8.4c0.4,2.6 -2.3,4.6 -4.7,3.3l-7.2,-3.8c-0.6,-0.3 -1.4,-0.3 -2,0z" fill="#fcc419" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M37.5,38.7c0.4,2.7 -2.4,4.7 -4.9,3.5l-7.6,-3.9c-0.6,-0.3 -1.4,-0.3 -2.1,0l-7.6,3.9c-2.4,1.3 -5.3,-0.8 -4.9,-3.5l1.3,-8.7c0.1,-0.7 -0.1,-1.4 -0.6,-1.9l-5.8,-5.8c-1.9,-1.9 -0.9,-5.3 1.9,-5.7l4.4,-0.7" fill="none" stroke="#1c274c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17.6,14.1l3.4,-6.9c1.2,-2.5 4.8,-2.5 6,0l3.4,6.8c0.3,0.6 0.9,1.1 1.7,1.2l8.7,1.3c2.7,0.4 3.8,3.7 1.9,5.7l-5.8,5.8c-0.5,0.5 -0.7,1.2 -0.6,1.9l0.4,2.6" fill="none" stroke="#1c274c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path></g></g></svg>
                            <?php 
                                endfor;
                            ?>
                        </div>
                        <?php 
                            endif;
                        ?>

                        <h2 class="trip--title">
                            <?php the_title(); ?>
                        </h2>

                        <div class="q--line__h"></div>

                        <div class="price--and--btn">
                            <div class="trip--price">
                                <span>تبدأ من</span>
                                <p>
                                    <?php echo get_field('price'); ?>
                                    <span>ريال</span>
                                </p>
                            </div>
                            <button class="q--btn">
                                <span>عرض التفاصيل</span>
                            </button>
                        </div>

                        <div class="trip--tags">
                            <?php 
                                if (get_field('featured')) :
                            ?>
                            <span class="q--tag q--tag__brown">
                                مميزة
                            </span>
                            <?php 
                                endif;
                            ?>
                        </div>
                    </a>
                </div>
                <?php 
                    endwhile;
                ?>
            </div>

            <div class="swiper-scrollbar trips--scrollbar"></div>
        </div>

        <?php 
            if($trips_section['btn']['show-btn']) :
        ?>
        <div class="q--btn__group">
            <a class="q--btn" href="<?php echo $trips_section['btn']['text-and-url']['url']; ?>" target="<?php echo $trips_section['btn']['text-and-url']['target']; ?>">
                <span>
                    <?php 
                        echo $trips_section['btn']['text-and-url']['title'];
                    ?>
                </span>
            </a>
        </div>
        <?php endif; ?>
    </div>
    <?php 
        endif;
        wp_reset_postdata();
    ?>
</section>
<!-- end trips section -->
<?php
    return ob_get_clean();
}
add_shortcode('trips-section', 'trips_section_shortcode');


function testimonials_section_shortcode() {
    ob_start();
    // Your PHP code here
    ?>

    <!-- testimonials section -->
    <section class="q--section testimonials--section">
      <?php 
        $testimonials_section = get_field('testimonials-section', 'option');
      ?>
      <div class="contain">
        <div class="section--title">
          <div class="q--heading__box">
            <div class="heading--box__text">
              <p class="heading--box__subtitle">
                <?php 
                  echo $testimonials_section['subtitle'];
                ?>
              </p>
              <h2 class="heading--box__title">
                <?php 
                  echo $testimonials_section['title'];
                ?>
              </h2>
            </div>
            <svg width="227" height="196" viewBox="0 0 227 196" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_1436_617)">
              <path d="M227 174.995V118.982C227 88.3508 219.908 62.97 205.723 42.84C190.947 22.1267 169.37 7.97759 140.992 0.392588C139.445 -0.0494154 137.814 -0.121215 136.234 0.183131C134.653 0.487477 133.169 1.15919 131.905 2.14263C130.56 3.07513 129.471 4.32305 128.735 5.7741C128 7.22516 127.642 8.83382 127.694 10.4554V25.3308C127.721 27.4562 128.418 29.5205 129.688 31.2372C130.885 33.0362 132.692 34.3548 134.786 34.956C165.525 46.0397 180.895 67.0443 180.895 97.9698H148.968C146.166 97.9208 143.382 98.439 140.79 99.4924C138.198 100.546 135.852 102.112 133.897 104.095C131.888 106.025 130.301 108.34 129.234 110.899C128.167 113.457 127.642 116.204 127.691 118.97V174.983C127.642 177.749 128.167 180.496 129.234 183.055C130.301 185.613 131.888 187.929 133.897 189.858C135.852 191.841 138.198 193.408 140.79 194.461C143.382 195.514 146.166 196.033 148.968 195.984H205.723C208.526 196.033 211.309 195.514 213.901 194.461C216.493 193.408 218.839 191.841 220.794 189.858C222.801 187.93 224.388 185.617 225.455 183.06C226.522 180.504 227.048 177.759 227 174.995ZM78.0303 195.996H21.2803C18.4776 196.045 15.6943 195.526 13.1022 194.473C10.5101 193.42 8.16417 191.853 6.20906 189.87C4.20016 187.941 2.61311 185.625 1.54578 183.067C0.478455 180.508 -0.046524 177.761 0.00323486 174.995V118.982C-0.046524 116.216 0.478455 113.469 1.54578 110.911C2.61311 108.352 4.20016 106.037 6.20906 104.107C8.16422 102.124 10.5102 100.558 13.1022 99.5045C15.6943 98.451 18.4776 97.9328 21.2803 97.9818H53.2026C53.2026 67.0585 37.8329 46.0539 7.09338 34.9681C4.99988 34.3668 3.19232 33.0482 1.99574 31.2492C0.725784 29.5325 0.0286407 27.4682 0.00102234 25.3428V10.4674C-0.0501862 8.84586 0.307861 7.23719 1.04294 5.78614C1.77803 4.33508 2.86708 3.08716 4.21211 2.15466C5.4769 1.17123 6.96095 0.499494 8.54126 0.195148C10.1216 -0.109198 11.7526 -0.0373988 13.2992 0.404604C41.6746 7.98815 63.2516 22.1373 78.0303 42.852C92.2151 62.9812 99.3074 88.3621 99.3074 118.994V175.007C99.3572 177.773 98.8322 180.52 97.7649 183.079C96.6975 185.637 95.1105 187.953 93.1016 189.882C91.1458 191.864 88.7996 193.429 86.2075 194.481C83.6155 195.533 80.8326 196.05 78.0303 196V195.996Z" fill="url(#paint0_linear_1436_617)"/>
              </g>
              <defs>
              <linearGradient id="paint0_linear_1436_617" x1="113.5" y1="-0.00195312" x2="113.5" y2="196.003" gradientUnits="userSpaceOnUse">
              <stop stop-opacity="0.13"/>
              <stop offset="1" stop-color="#FAFAFA" stop-opacity="0.15"/>
              </linearGradient>
              <clipPath id="clip0_1436_617">
              <rect width="227" height="196" fill="white" transform="matrix(-1 0 0 1 227 0)"/>
              </clipPath>
              </defs>
            </svg>
              
            
          </div>
        </div>

        <div class="testimonials--list">
        </div>

      </div>
    </section>
    <!-- end testimonials section -->
	   
    <?php
    return ob_get_clean();
}
add_shortcode('testimonials-section', 'testimonials_section_shortcode');

function features_section_shortcode() {
    ob_start();
    // Your PHP code here
    ?>

  <?php
      $features_section = get_field('features-section', 'option');
      if($features_section):
    ?>

    <!-- features section -->
    <section class="q--section features--section">
      <div class="contain">
        <ul class="features--list">
          <?php 
            foreach($features_section as $feature):
          ?>
          <li class="feature--item">
            <img loading="lazy" class="feature--icon" src="<?php echo $feature['feature']['icon']; ?>" alt="icon">
            <div class="feature--details">
              <h3 class="feature--title">
                <?php echo $feature['feature']['title']; ?>
              </h3>
              <div class="feature--text">
                <p>
                  <?php echo $feature['feature']['desc']; ?>
                </p>
            </div>                
          </li>
          <?php 
            endforeach;
          ?>
        </ul>
      </div>
    </section>
    <!-- end features section -->

    <?php 
      endif;
    ?>
	   
    <?php
    return ob_get_clean();
}
add_shortcode('features-section', 'features_section_shortcode');

function cta_section_shortcode() {
    ob_start();
    // Your PHP code here
    ?>
	     <?php 
      $cta_section = get_field('cta-section', 'option');
    ?>
	       <!-- cta section -->
    <section class="q--section cta--section" style="background-image: url(<?php echo $cta_section['img']; ?>)">
      <div class="q--overlay"></div>
      <div class="contain">
        <div class="cta--content">
          <h2 class="cta--title">
            <?php echo $cta_section['title']; ?>
          </h2>
          <p class="cta--text">
            <?php echo $cta_section['desc']; ?>
          </p>
        </div>

        <?php 
          if($cta_section['btn']['show-btn']):
        ?>
        <a class="q--btn" href="<?php echo $cta_section['btn']['text-and-url']['url']; ?>" target="<?php echo $cta_section['btn']['text-and-url']['target']; ?>">
          <span>
            <?php echo $cta_section['btn']['text-and-url']['title']; ?>
          </span>
        </a>
        <?php 
          endif;
        ?>
      </div>
    </section>
    <!-- end cta section -->
	   
	   
    <?php
    return ob_get_clean();
}
add_shortcode('cta-section', 'cta_section_shortcode');

function blog_section_shortcode() {
    ob_start();
    // Your PHP code here
    ?>
  <!-- blog section -->
    <section class="q--section blog--section">

      <?php 
        $blog_section = get_field('blog-section', 'option');      
      ?>
      <div class="contain">
        <div class="q--heading__box">
          <div class="heading--box__text">
            <p class="heading--box__subtitle">
              <?php echo $blog_section['subtitle']; ?>
            </p>
            <h2 class="heading--box__title">
              <?php echo $blog_section['title']; ?>
            </h2>
          </div>
        </div>

        <?php 
          // loop on posts
          $blogArgs = array(
            'post_type' => 'post',
            'posts_per_page' => $blog_section['articles-number'],
            'status' => 'published',
            
          );

          $blogPosts = new WP_Query($blogArgs);

          if($blogPosts->have_posts()):

        ?>
        <ul class="articles--list">
          <?php 
            while($blogPosts->have_posts()):
              $blogPosts->the_post();
          ?>
          <li class="article--item">
            <a href="<?php the_permalink(); ?>">
              <img width="600" height="400" loading="lazy" src="<?php echo featuredImage(); ?>" 
               alt="article image" class="article--img">
              <div class="article--details">
                <div class="article--date">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="48px" height="48px" viewBox="0,0,256,256"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="none" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.33333,5.33333)"><path d="M38.182,44h-20.364c-3.213,0 -5.818,-2.605 -5.818,-5.818v-20.364c0,-3.213 2.605,-5.818 5.818,-5.818h20.364c3.213,0 5.818,2.605 5.818,5.818v20.364c0,3.213 -2.605,5.818 -5.818,5.818z" fill-opacity="0.67059" fill="#24b26f" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"></path><path d="M22.5,13.5v12h8" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M40.5,32.617v1.883c0,3.314 -2.686,6 -6,6h-21c-3.314,0 -6,-2.686 -6,-6v-9.968" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.5,16.362v-2.862c0,-3.314 2.686,-6 6,-6h21c3.314,0 6,2.686 6,6v12" fill="none" stroke="#18193f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="22.5" cy="25.5" r="2.5" fill="#18193f" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter"></circle></g></g></svg>

                  <span>
                    <?php echo get_the_date('j F Y'); ?>
                  </span>
                </div>

                <h2 class="article--title">
                  <?php the_title(); ?>
                </h2>

                <p class="article--excerpt">
                  <?php echo display_custom_excerpt(); ?>
                </p>
              </div>
            </a>
          </li>
          <?php 
            endwhile;
          ?>
        </ul>
        <?php 
          endif;
        ?>

        <?php
          if($blog_section['btn']['show-btn']):
        ?>

        <div class="q--btn__group">
          <a class="q--btn" href="<?php echo $blog_section['btn']['text-and-url']['url']; ?>" target="<?php echo $blog_section['btn']['text-and-url']['target']; ?>">
            <span>
              <?php echo $blog_section['btn']['text-and-url']['title']; ?>
            </span>
          </a>
        </div>
        <?php 
          endif;
        ?>
      </div>
    </section>
    <!-- end blog section -->

	   
    <?php
    return ob_get_clean();
}
add_shortcode('blog-section', 'blog_section_shortcode');

function contact_section_shortcode() {
    ob_start();
    // Your PHP code here
    ?>

    <!-- contact section -->
    <section class="q--section contact--section">

      <?php 
        $contact_section = get_field('main-contact-form', 'option');
      ?>
      <div class="contain">
        <img loading="lazy" class="contact--img" src="<?php echo $contact_section['img']; ?>" alt="contact image">

        <div class="contact--form">
          <div class="q--heading__box">
            <div class="heading--box__text">
              <p class="heading--box__subtitle">
                <?php echo $contact_section['subtitle']; ?>
              </p>
              <h2 class="heading--box__title">
                <?php echo $contact_section['title']; ?>
              </h2>
            </div>
          </div>

          <?php 
            echo do_shortcode($contact_section['shortcode']);
          ?>
        </div>
      </div>
    </section>
    <!-- end contact section -->
	   
    <?php
    return ob_get_clean();
}
add_shortcode('contact-section', 'contact_section_shortcode');


function add_site_kit_user_role() {
    add_role(
        'google_kit_user',
        'Google Kit User',
        array(
            'read'                      => true,
            'googlesitekit_authenticate' => true, // Required for Site Kit login
            'googlesitekit_view_dashboard' => true, // View dashboard
            'manage_options'             => true, // Required for Site Kit settings
        )
    );
}
add_action('init', 'add_site_kit_user_role');




