package licenta.retrievedata.entitites;
import jakarta.persistence.*;


@Entity
public class RetrievedData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

   private String url;

   private String imageUrl;

    private double price;

    @Column(length=50000)
    private String description;

    public RetrievedData() {
    }

    public RetrievedData(Long id, String title, String url, String imageUrl, double price, String description) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
